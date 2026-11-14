#!/usr/bin/env python3
"""Explicit planning arithmetic. No network, GPU, deployment, or training."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load():
    return json.loads((ROOT / "inputs.json").read_text())


def workload(config, paid_users=50, usage_factor=1, paid_fraction=None):
    f = config["finance"]
    fraction = paid_fraction if paid_fraction is not None else f["paid_fraction"]
    if not 0 < fraction <= 1 or paid_users <= 0 or usage_factor <= 0:
        raise ValueError("positive cohort/usage and valid paid fraction required")
    plus = paid_users * f["plus_share_of_paid"]
    population = {"Free": paid_users * (1 / fraction - 1),
                  "Plus": plus, "Premium": paid_users - plus}
    rows = []
    for tier, ops in config["ops"].items():
        for core, (count, tokens_in, tokens_out) in ops.items():
            requests = population[tier] * count * usage_factor
            rows.append({"tier": tier, "core": core, "requests": requests,
                         "input_tokens": requests * tokens_in,
                         "output_tokens": requests * tokens_out})
    return {"paid_users": paid_users, "population": population,
            "usage_factor": usage_factor, "rows": rows,
            **{key: sum(row[key] for row in rows)
               for key in ["requests", "input_tokens", "output_tokens"]}}


def financial(config, paid_users, fee):
    f = config["finance"]
    avg_price = sum(config["prices_jpy"][tier] * share for tier, share in
                    [("Plus", f["plus_share_of_paid"]),
                     ("Premium", 1 - f["plus_share_of_paid"])])
    receipts = paid_users * (avg_price / 1.1 - avg_price * fee)
    fixed = sum(f["common_fixed_jpy"].values())
    room = receipts * f["operating_room_fraction"]
    return {"average_price_jpy": avg_price, "gross_sales_jpy": paid_users * avg_price,
            "receipts_planning_jpy": receipts,
            "shared_fixed_jpy": fixed, "operating_room_target_jpy": room,
            "allowable_gpu_jpy": receipts - fixed - room}


def calculate(config, paid_users=50, usage_factor=1, route="flex24",
              profile="reference_serial", fee=None, paid_fraction=None):
    f = config["finance"]
    fee = fee if fee is not None else f["fee_main"]
    w = workload(config, paid_users, usage_factor, paid_fraction)
    money = financial(config, paid_users, fee)
    p, r = config["profiles"][profile], config["routes"][route]
    decode = w["output_tokens"] / p["output_tps"]
    prefill = w["input_tokens"] / p["prefill_tps"] if p["prefill_tps"] else 0
    # Episodes are an explicit sensitivity assumption, not one idle charge per job.
    episodes = math.ceil(w["requests"] * p["cold_fraction"] - 1e-9)
    startup = episodes * p["cold_start_seconds"]
    idle = episodes * p["idle_seconds"]
    rounding_allowance = episodes * p["rounding_allowance_seconds_per_episode"]
    service = decode + prefill
    month_hours = 24 * f["days_per_month"]
    if r["kind"] == "flex":
        billed_seconds = service + startup + idle + rounding_allowance
        gpu_cost = billed_seconds / 3600 * r["usd_per_hour"] * f["jpy_per_usd_assumption"]
        sizing_workers = math.ceil(billed_seconds / (month_hours * 3600 * .6))
        capacity_screen = (sizing_workers <= config["selected_costing_arrangement"]["max_workers"]
                           and p["concurrency_assumption"] == config["selected_costing_arrangement"]["max_sequences_per_worker_reference"])
        required_workers = sizing_workers
    else:
        # Do not fit a month's work by silently dropping jobs or keeping one undersized GPU.
        required_workers = math.ceil(service / (month_hours * 3600 * r["target_monthly_utilization"]))
        billed_seconds = required_workers * month_hours * 3600
        gpu_cost = required_workers * month_hours * r["usd_per_hour"] * f["jpy_per_usd_assumption"]
        capacity_screen = None  # An average-work sizing allowance does not prove peak SLA.
    total = money["shared_fixed_jpy"] + gpu_cost
    balance = money["receipts_planning_jpy"] - total
    after_room = balance - money["operating_room_target_jpy"]
    gpu_budget_seconds = money["allowable_gpu_jpy"] / (r["usd_per_hour"] * f["jpy_per_usd_assumption"] / 3600)
    required_decode_only_tps = (w["output_tokens"] / gpu_budget_seconds
                                if gpu_budget_seconds > 0 else None)
    return {"paid_users": paid_users, "paid_fraction": paid_fraction or f["paid_fraction"],
            "free_users": w["population"]["Free"], "usage_factor": usage_factor,
            "route": route, "profile": profile, "fee_sensitivity": fee,
            "monthly_requests": w["requests"], "input_tokens": w["input_tokens"],
            "output_tokens": w["output_tokens"], **money,
            "decode_gpu_seconds": decode, "prefill_gpu_seconds_assumed": prefill,
            "cold_episodes_assumed": episodes, "startup_seconds_assumed": startup,
            "idle_seconds_assumed": idle, "rounding_allowance_seconds": rounding_allowance,
            "billed_gpu_hours_planned": billed_seconds / 3600,
            "required_workers_average_sizing_only": required_workers,
            "within_configured_average_capacity_screen": capacity_screen,
            "profile_requires_concurrency_configuration_change": p["concurrency_assumption"] != config["selected_costing_arrangement"]["max_sequences_per_worker_reference"],
            "gpu_cost_jpy_planned": gpu_cost, "total_operating_cost_jpy_planned": total,
            "balance_before_payroll_ads_training_jpy": balance,
            "balance_after_room_target_jpy": after_room,
            "within_operating_envelope_arithmetic": after_room >= 0,
            "necessary_decode_only_tps_if_all_other_gpu_cost_zero": required_decode_only_tps,
            "production_performance_verified": False, "adoption_allowed_by_this_report": False}


def break_even_flex(config, profile, usage_factor=1, fee=None, reserve=True):
    # With a fixed paid/free ratio, variable work scales with paid users.
    f = config["finance"]
    row = calculate(config, paid_users=500, profile=profile,
                    usage_factor=usage_factor, fee=fee)
    per_paid = (row["receipts_planning_jpy"] * (1 - f["operating_room_fraction"] if reserve else 1)
                - row["gpu_cost_jpy_planned"]) / 500
    if per_paid <= 0:
        return {"paid_users": None, "reason": "NONPOSITIVE_VARIABLE_MARGIN_AT_FIXED_FREE_RATIO"}
    # Round to five paid members to keep the 80/20 cohort integral, then verify episode rounding.
    paid = max(5, math.ceil(sum(f["common_fixed_jpy"].values()) / per_paid / 5) * 5)
    while True:
        check = calculate(config, paid_users=paid, profile=profile,
                          usage_factor=usage_factor, fee=fee)
        value = check["balance_after_room_target_jpy"] if reserve else check["balance_before_payroll_ads_training_jpy"]
        if value >= 0:
            return {"paid_users": paid, "reason": "ARITHMETIC_ONLY_CAPACITY_PERFORMANCE_UNVERIFIED"}
        paid += 5


def report(config):
    main = calculate(config)
    rows = [calculate(config, n, factor, fee=fee)
            for n in [10, 50, 100, 200, 500]
            for factor in [.5, 1, 2]
            for fee in [.26, .15]]
    alternatives = [calculate(config, route=route, profile=profile)
                    for route in config["routes"] for profile in config["profiles"]]
    cohorts = [calculate(config, paid_fraction=fraction)
               for fraction in [.05, .1, .2, 1]]
    return {"schema": "cocolon_production_economics_results.v1",
            "status": "CALCULATED_SCENARIOS_NOT_MEASURED_PRODUCTION_COSTS",
            "baseline_workload": workload(config), "main_scenario": main,
            "same_route_same_token_work_same_assumed_performance_means_same_4b_9b_cost": True,
            "population_usage_fee_sensitivity": rows,
            "route_performance_sensitivity_at_paid50": alternatives,
            "paid_conversion_sensitivity_at_paid50": cohorts,
            "break_even_with_fixed_paid_free_ratio": {
                p: {"operating_costs_only": break_even_flex(config, p, reserve=False),
                    "with_room_target": break_even_flex(config, p)}
                for p in config["profiles"]},
            "quality_accepted": False, "gpu_execution_performed": False,
            "deployment_performed": False}


if __name__ == "__main__":
    data = report(load())
    print(json.dumps(data, ensure_ascii=False, indent=2) + "\n", end="")
