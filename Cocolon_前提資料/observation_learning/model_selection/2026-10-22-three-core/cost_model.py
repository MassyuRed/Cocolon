"""Cocolon 2026-10-23 planning arithmetic. No network or paid inference.

Seconds, utilization, plan mix and conversion are scenarios, not measurements.
Run with Python 3; emits cost_scenarios.csv and a bounded console summary.
"""
import csv
import math
from pathlib import Path

FX = 160
SERVERLESS_USD_H = 1.22
POD_USD_H = 0.59
MONTH_H = 720
STARTUP_S_PER_JOB = 10  # Allocated average; unmeasured, not a provider promise.
IDLE_S_PER_JOB = 5
RETRY_FACTOR = 1.2  # Reserve; mandatory extra model passes are separate below.
PAYMENT_RESERVE_FACTOR = 1.1  # Planning reserve, not a statement of tax liability.
FIXED_JPY = 11000  # 8000 API/DB + 560 model volume + 2440 other reserve.
PIECE_S, ANALYSIS_S, IF_S = 45, 120, 90
PLANS = {
    "Free": dict(emlis_calls=6, emlis_s=20, piece=1, analysis=1, if_route=0),
    "Plus": dict(emlis_calls=120, emlis_s=25, piece=30, analysis=4, if_route=0),
    "Premium": dict(emlis_calls=240, emlis_s=30, piece=60, analysis=8, if_route=4),
}
PRICE_SETS = {
    "current_display_counterfactual": (300, 980),
    "980_1980": (980, 1980),
    "1480_2980": (1480, 2980),
    "1980_3980": (1980, 3980),
}


def plan_cost(plan, usage=1, passes=1, startup_s=STARTUP_S_PER_JOB, fx=FX):
    p = PLANS[plan]
    work_s = (p["emlis_calls"] * p["emlis_s"] + p["piece"] * PIECE_S
              + p["analysis"] * ANALYSIS_S + p["if_route"] * IF_S)
    jobs = p["emlis_calls"] + p["piece"] + p["analysis"] + p["if_route"]
    # Multi-pass scenario retains the worker between passes; a separate worker
    # for each pass needs additional start/idle time beyond this scenario.
    billed_s = usage * RETRY_FACTOR * (
        work_s * passes + jobs * (startup_s + IDLE_S_PER_JOB))
    gpu_jpy = billed_s / 3600 * SERVERLESS_USD_H * fx
    return dict(work_s=work_s * usage * passes * RETRY_FACTOR,
                jobs=jobs * usage, billed_s=billed_s, gpu_jpy=gpu_jpy,
                reserved_jpy=gpu_jpy * PAYMENT_RESERVE_FACTOR)


def net_budget(price, fee):
    # Conservative budget after a 10% sales-tax-equivalent reserve and gross
    # price fee deduction; NOT actual store payout or settled tax accounting.
    return price / 1.1 - price * fee


def service(mau, conversion, prices, fee=.15, usage=1, passes=1, startup_s=10,
            plus_share=.8, fx=FX):
    paid_n = mau * conversion
    free_n = mau - paid_n
    costs = {n: plan_cost(n, usage, passes, startup_s, fx) for n in PLANS}
    paid_cost = (plus_share * costs["Plus"]["reserved_jpy"]
                 + (1-plus_share) * costs["Premium"]["reserved_jpy"])
    paid_net = (plus_share * net_budget(prices[0], fee)
                + (1-plus_share) * net_budget(prices[1], fee))
    variable = free_n * costs["Free"]["reserved_jpy"] + paid_n * paid_cost
    revenue = paid_n * paid_net
    balance = revenue - variable - FIXED_JPY
    contribution_per_mau = (revenue - variable) / mau
    break_mau = (math.ceil(FIXED_JPY / contribution_per_mau)
                 if contribution_per_mau > 0 else None)
    income100k_mau = (math.ceil((FIXED_JPY + 100000) / contribution_per_mau)
                       if contribution_per_mau > 0 else None)
    return dict(mau=mau, conversion=conversion, fee=fee, usage=usage,
                plus_share=plus_share, passes=passes, startup_s=startup_s, fx=fx,
                paid_n=paid_n, net_sales_budget=round(revenue, 4),
                variable_reserved_jpy=round(variable, 4), fixed_jpy=FIXED_JPY,
                balance_jpy=round(balance, 4), break_even_mau=break_mau,
                mau_for_100000_before_salary_tax=income100k_mau)


def main():
    rows = []
    for name, prices in PRICE_SETS.items():
        for fee in (.15, .26):
            for usage in (.5, 1):
                for conversion in (.05, .1, .2):
                    for mau in (100, 1000, 10000):
                        rows.append(dict(price_set=name,
                                         **service(mau, conversion, prices, fee, usage)))
    for name, prices in PRICE_SETS.items():
        for passes, startup in ((2, 10), (1, 60), (2, 60)):
            rows.append(dict(price_set=name,
                             **service(1000, .1, prices, .26, 1, passes, startup)))
        for share in (0, 1):
            rows.append(dict(price_set=name,
                             **service(1000, .05, prices, .26, 1, plus_share=share)))
        for fx in (140, 180):
            rows.append(dict(price_set=name,
                             **service(1000, .1, prices, .26, 1, fx=fx)))
    out = Path(__file__).with_name("cost_scenarios.csv")
    with out.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["price_set", *service(1000, .1, (1980, 3980))])
        writer.writeheader()
        writer.writerows(rows)
    print("plan_cost_full_quota", {n: plan_cost(n) for n in PLANS})
    print("two_pass", {n: round(plan_cost(n, passes=2)["reserved_jpy"], 2) for n in PLANS})
    print("60s_cold", {n: round(plan_cost(n, startup_s=60)["reserved_jpy"], 2) for n in PLANS})
    for prices in ((300, 980), (980, 1980), (1480, 2980), (1980, 3980)):
        for fee in (.15, .26):
            print(prices, fee, [service(1000, c, prices, fee) for c in (.05, .1, .2)])
    print("pod_month_gpu_only", POD_USD_H * MONTH_H * FX)
    print("serverless_pod_gpu_price_cross_billed_hours", POD_USD_H * MONTH_H / SERVERLESS_USD_H)
    assert abs(plan_cost("Free")["reserved_jpy"] - 28.9872) < 1e-8
    assert abs(plan_cost("Plus")["reserved_jpy"] - 511.0336) < 1e-8
    assert abs(plan_cost("Premium")["reserved_jpy"] - 1138.016) < 1e-8
    assert len(rows) == 172


if __name__ == "__main__":
    main()
