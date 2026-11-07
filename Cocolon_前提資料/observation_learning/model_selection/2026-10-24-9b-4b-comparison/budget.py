#!/usr/bin/env python3
"""Illustrative price envelope, not actual payouts, approved quotas or a profit forecast."""
import json
from decimal import Decimal as D


def calculate():
    rows = []
    for count in [10, 50, 100, 500]:
        for fee in [D("0.15"), D("0.26")]:
            # Preserve the prior conservative planning formula, not tax accounting.
            per_paid = D("0.8") * (D(680) / D("1.1") - fee * 680) + D("0.2") * (D(1480) / D("1.1") - fee * 1480)
            net = count * per_paid
            for reserve in [D(0), D("0.2")]:
                remaining = net * (1 - reserve) - 11000
                free_count = count * 19  # Illustrative 5% paid conversion.
                nominal_generations = free_count * 66 + count * D("0.8") * 238 + count * D("0.2") * 676
                rates = {"pod_a40": D("0.59"), "pod_a5000": D("0.27"), "flex_48gb": D("1.22"),
                         "flex_24gb": D("0.69"), "flex_16gb": D("0.58")}
                hours = {name: max(D(0), remaining) / (rate * 160) for name, rate in rates.items()}
                row = {"paid_users": count, "free_users_if_5pct_paid": free_count,
                       "fee_assumption": float(fee), "net_receipts_planning_jpy": round(float(net), 2),
                       "reserve_fraction_proposal": float(reserve), "shared_backend_budget_jpy": 11000,
                       "remaining_all_inference_storage_etc_jpy": round(float(remaining), 2),
                       "nominal_monthly_generations_scenario": int(nominal_generations),
                       "max_gpu_hours_before_storage": {k: round(float(v), 3) for k, v in hours.items()},
                       "max_average_flex48_billable_gpu_seconds_per_nominal_generation": round(float(hours["flex_48gb"] * 3600 / nominal_generations), 3)}
                rows.append(row)
    return {"schema": "cocolon_680_1480_price_envelope.v1", "status": "ILLUSTRATIVE_NOT_MEASURED_PROFIT",
            "prices_jpy": {"plus": 680, "premium": 1480}, "paid_mix": {"plus": 0.8, "premium": 0.2},
            "assumed_jpy_per_usd_not_current_fx": 160, "pricing_checked_jst": "2026-10-24",
            "formula": "price/1.1 - fee*price; weighted receipts*(1-reserve) - shared backend",
            "free_usage_is_inside_gpu_budget_not_a_second_token_bill": True,
            "usage_scenarios_are_not_product_quotas": True, "reserve_is_not_approved_margin": True,
            "limits": "Remaining amount pays Free+paid inference, storage and other costs. GPU hours ignore storage, capacity, model fit, cold start and batching. No payroll, ads, refunds or training expense has been subtracted.",
            "sources": ["https://www.runpod.io/pricing", "https://docs.runpod.io/serverless/pricing",
                        "https://developer.apple.com/support/app-distribution-in-japan/"], "rows": rows}


if __name__ == "__main__":
    print(json.dumps(calculate(), ensure_ascii=False, indent=2))
