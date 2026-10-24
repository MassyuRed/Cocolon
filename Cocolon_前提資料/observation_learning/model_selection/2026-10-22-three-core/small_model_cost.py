"""2026-10-23 Qwen3.5-9B public API cost scenarios; no network/inference.

Published token prices, assumed token volumes. This is NOT a quote for a
fine-tuned/custom endpoint. Usage counts are scenarios, not adopted quotas.
"""
import math

PRICE_IN, PRICE_OUT = .10, .15  # USD per 1M tokens, DeepInfra standard tier.
FX, RESERVE = 160, 1.2 * 1.1
FIXED_JPY = 11000  # Prior common-infra budget retained conservatively.
OPS = {
    "Free": {"Emlis": (60, 2000, 512), "Piece": (5, 4000, 1000),
             "Analysis": (1, 64000, 4000)},
    "Plus": {"Emlis": (200, 4000, 768), "Piece": (30, 4000, 1000),
             "Analysis": (8, 64000, 4000)},
    "Premium": {"Emlis": (600, 8000, 1024), "Piece": (60, 4000, 1000),
                "Analysis": (12, 64000, 4000), "IF_future": (4, 16000, 3000)},
}


def plan_cost(name, token_factor=1, fx=FX, price_in=PRICE_IN, price_out=PRICE_OUT):
    ops = OPS[name]
    ti = sum(n * i for n, i, o in ops.values()) * token_factor
    to = sum(n * o for n, i, o in ops.values()) * token_factor
    return dict(input_tokens=ti, output_tokens=to,
                reserved_jpy=(ti * price_in + to * price_out) / 1e6 * fx * RESERVE)


def service(mau, paid_fraction, fee, token_factor=1, plus_share=.8,
            fx=FX, price_in=PRICE_IN, price_out=PRICE_OUT):
    costs = {p: plan_cost(p, token_factor, fx, price_in, price_out)["reserved_jpy"]
             for p in OPS}
    avg_price = plus_share * 980 + (1-plus_share) * 1980
    net_sales_budget = mau * paid_fraction * (avg_price / 1.1 - avg_price * fee)
    variable = (mau * (1-paid_fraction) * costs["Free"]
                + mau * paid_fraction * (plus_share * costs["Plus"]
                                        + (1-plus_share) * costs["Premium"]))
    contribution_per_mau = (net_sales_budget - variable) / mau
    return dict(mau=mau, paid_fraction=paid_fraction, fee=fee,
                token_factor=token_factor, plus_share=plus_share,
                net_sales_budget=net_sales_budget, variable=variable,
                balance=net_sales_budget-variable-FIXED_JPY,
                break_even_mau=(math.ceil(FIXED_JPY/contribution_per_mau)
                                if contribution_per_mau > 0 else None))


if __name__ == "__main__":
    for p in OPS:
        print(p, plan_cost(p))
    for mau in (100, 1000, 10000):
        for c in (.05, .1, .2):
            for fee in (.15, .26):
                print(service(mau, c, fee))
    for factor in (2, 5):
        print("all_token_multiplier", service(1000, .05, .26, factor))
    print("all_plus", service(1000, .05, .26, plus_share=1))
    print("fx180", service(1000, .05, .26, fx=180))
    print("together_rate_comparison",
          service(1000, .05, .26, price_in=.17, price_out=.25))
    assert abs(plan_cost("Free")["reserved_jpy"] - 5.5668096) < 1e-8
    assert abs(plan_cost("Plus")["reserved_jpy"] - 37.074048) < 1e-8
    assert abs(plan_cost("Premium")["reserved_jpy"] - 147.282432) < 1e-8
