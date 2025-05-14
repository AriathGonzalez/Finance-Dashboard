const express = require("express");
const router = express.Router();
const supabase = require("../lib/supabase");

router.get("/get-payroll", async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ error: "Missing 'month' or 'year' query parameter" });
  }

  const { data, error } = await supabase.rpc("get_monthly_payroll_expenses", {
    month_input: parseInt(month, 10),
    year_input: parseInt(year, 10),
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ expenses: data });
});

router.get("/get-other", async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ error: "Missing 'month' or 'year' query parameter" });
  }

  const { data, error } = await supabase.rpc("get_monthly_other_expenses", {
    month_input: parseInt(month, 10),
    year_input: parseInt(year, 10),
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ other_expenses: data });
});

router.get("/get-contracted-services", async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ error: "Missing 'month' or 'year' query parameter" });
  }

  const { data, error } = await supabase.rpc(
    "get_monthly_contracted_services",
    {
      month_input: parseInt(month, 10),
      year_input: parseInt(year, 10),
    }
  );

  if (error) return res.status(500).json({ error: error.message });

  res.json({ contracted_services_expenses: data });
});

router.get("/get-debt-services", async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ error: "Missing 'month' or 'year' query parameter" });
  }

  const { data, error } = await supabase.rpc("get_monthly_debt_services", {
    month_input: parseInt(month, 10),
    year_input: parseInt(year, 10),
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ debt_services_expenses: data });
});

router.get("/get-supplies-materials", async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ error: "Missing 'month' or 'year' query parameter" });
  }

  const { data, error } = await supabase.rpc("get_monthly_supplies_materials", {
    month_input: parseInt(month, 10),
    year_input: parseInt(year, 10),
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ supplies_materials_expenses: data });
});

router.get("/get-capital-outlay", async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ error: "Missing 'month' or 'year' query parameter" });
  }

  const { data, error } = await supabase.rpc("get_monthly_capital_outlay", {
    month_input: parseInt(month, 10),
    year_input: parseInt(year, 10),
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ capital_outlay_expenses: data });
});

module.exports = router;
