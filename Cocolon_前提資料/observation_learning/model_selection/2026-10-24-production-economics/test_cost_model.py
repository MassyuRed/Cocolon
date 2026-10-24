import copy
import unittest

import cost_model as cm


class EconomicsChecks(unittest.TestCase):
    def setUp(self):
        self.config = cm.load()

    def test_reuses_original_workload_and_counts_free_compute(self):
        w = cm.workload(self.config)
        self.assertEqual(w["population"], {"Free": 950, "Plus": 40, "Premium": 10})
        self.assertEqual(w["requests"], 78980)
        self.assertEqual(w["input_tokens"], 309800000)
        self.assertEqual(w["output_tokens"], 53702000)
        free = sum(x["output_tokens"] for x in w["rows"] if x["tier"] == "Free")
        self.assertEqual(free, 37734000)
        self.assertEqual(sum(x["requests"] for x in w["rows"] if x["core"] == "Emlis"), 71000)

    def test_main_accounting_and_no_second_volume_bill(self):
        r = cm.calculate(self.config)
        self.assertEqual(r["shared_fixed_jpy"], 11000)
        self.assertAlmostEqual(r["allowable_gpu_jpy"], 10809.4545454545)
        self.assertEqual(r["cold_episodes_assumed"], 7898)
        self.assertAlmostEqual(r["billed_gpu_hours_planned"], 761.7244444444)
        self.assertAlmostEqual(r["gpu_cost_jpy_planned"], 84094.3786666667)
        self.assertAlmostEqual(r["total_operating_cost_jpy_planned"], 95094.3786666667)
        self.assertFalse(r["within_operating_envelope_arithmetic"])

    def test_same_gpu_work_performance_does_not_charge_for_model_name(self):
        changed = copy.deepcopy(self.config)
        changed["selected_costing_arrangement"]["model_candidate"] = "Qwen3.5-9B"
        self.assertEqual(cm.calculate(changed), cm.calculate(self.config))

    def test_optimistic_zero_overheads_still_fails_at_fixed_25tps(self):
        r = cm.calculate(self.config, profile="optimistic_decode_only")
        self.assertEqual(r["startup_seconds_assumed"], 0)
        self.assertEqual(r["prefill_gpu_seconds_assumed"], 0)
        self.assertAlmostEqual(r["total_operating_cost_jpy_planned"], 76874.4533333333)
        self.assertLess(r["balance_before_payroll_ads_training_jpy"], 0)

    def test_capacity_growth_does_not_drop_work_to_fake_profit(self):
        small = cm.calculate(self.config, route="pod_a5000")
        large = cm.calculate(self.config, paid_users=500, route="pod_a5000")
        self.assertEqual(small["required_workers_average_sizing_only"], 2)
        self.assertGreater(large["required_workers_average_sizing_only"], 2)
        self.assertEqual(large["output_tokens"], 10 * small["output_tokens"])
        self.assertFalse(cm.calculate(self.config, paid_users=500)["within_configured_average_capacity_screen"])

    def test_more_users_cannot_fix_negative_variable_margin(self):
        self.assertIsNone(cm.break_even_flex(self.config, "reference_serial")["paid_users"])
        hypothetical = cm.calculate(self.config, profile="target_unmeasured")
        self.assertTrue(hypothetical["within_operating_envelope_arithmetic"])
        self.assertTrue(hypothetical["profile_requires_concurrency_configuration_change"])
        self.assertFalse(hypothetical["within_configured_average_capacity_screen"])
        self.assertFalse(hypothetical["production_performance_verified"])
        self.assertFalse(hypothetical["adoption_allowed_by_this_report"])


if __name__ == "__main__":
    unittest.main()
