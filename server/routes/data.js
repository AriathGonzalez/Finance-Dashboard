const express = require("express");
const router = express.Router();
const supabase = require("../lib/supabase");

router.get("/revenue", async (req, res) => {
  // Query the view to get the total revenue
  const { data, error } = await supabase.from("total_revenue_view").select("*");

  if (error) return res.status(500).json({ error: error.message });

  const totalRevenue = data[0]?.total_revenue || 0;

  res.json({ revenue: totalRevenue });
});

router.get("/expenses", async (req, res) => {
  const { data, error } = await supabase
    .from("total_expenses_view")
    .select("*");

  if (error) return res.status(500).json({ error: error.message });
  const total = Math.abs(parseFloat(data[0]?.total_expenses || 0));
  res.json({ expenses: total });
});

router.get("/net-profit", async (req, res) => {
  const revenueRes = await supabase.from("total_revenue_view").select("*");
  const expensesRes = await supabase.from("total_expenses_view").select("*");

  if (revenueRes.error || expensesRes.error) {
    return res.status(500).json({ error: "Failed to fetch revenue/expenses" });
  }

  const revenue = parseFloat(revenueRes.data[0]?.total_revenue || 0);
  const expenses = Math.abs(
    parseFloat(expensesRes.data[0]?.total_expenses || 0)
  );
  const net = revenue - expenses;

  res.json({ netProfit: net });
});

router.get("/revenue/range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Start date and end date are required" });
  }

  try {
    // Call the get_dynamic_revenue function via RPC, passing in the date parameters
    const { data, error } = await supabase.rpc("get_dynamic_revenue", {
      start_date: startDate,
      end_date: endDate,
    });
    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(data); // Return the data from the function
  } catch (err) {
    console.error("Error fetching dynamic revenue:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
