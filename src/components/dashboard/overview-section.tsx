"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
} from "lucide-react";
import { MetricCard } from "./metric-card";
import { useState, useEffect } from "react";

export function OverviewSection() {
  // Mock data for demonstration
  // const metrics = [
  //   {
  //     title: "Total Revenue",
  //     value: "$545,352,318.19",
  //     description: "+20.1% from last month",
  //     icon: DollarSign,
  //     iconClassName: "text-green-500",
  //   },
  //   {
  //     title: "Total Expenses",
  //     value: "$62,177,634.12",
  //     description: "+12.5% from last month",
  //     icon: TrendingDown,
  //     iconClassName: "text-red-500",
  //   },
  //   {
  //     title: "Net Profit",
  //     value: "$483,174,684.07",
  //     description: "+35.2% from last month",
  //     icon: TrendingUp,
  //     iconClassName: "text-green-500",
  //   },
  //   {
  //     title: "Budget Variance",
  //     value: "+$50,000",
  //     description: "Favorable variance",
  //     icon: PieChartIcon,
  //     iconClassName: "text-blue-500",
  //   },
  // ];
  const [metrics, setMetrics] = useState([
    {
      title: "Total Revenue",
      value: "$0",
      description: "",
      icon: DollarSign,
      iconClassName: "text-green-500",
    },
    {
      title: "Total Expenses",
      value: "$0",
      description: "",
      icon: TrendingDown,
      iconClassName: "text-red-500",
    },
    {
      title: "Net Profit",
      value: "$0",
      description: "",
      icon: TrendingUp,
      iconClassName: "text-green-500",
    },
    {
      title: "Budget Variance",
      value: "$0",
      description: "",
      icon: PieChartIcon,
      iconClassName: "text-blue-500",
    },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [revenueRes, expensesRes, profitRes] = await Promise.all([
          fetch("http://localhost:3001/data/revenue"),
          fetch("http://localhost:3001/data/expenses"),
          fetch("http://localhost:3001/data/net-profit"),
        ]);

        const [revenueData, expensesData, profitData] = await Promise.all([
          revenueRes.json(),
          expensesRes.json(),
          profitRes.json(),
        ]);
        console.log(profitData);
        setMetrics([
          {
            title: "Total Revenue",
            value: formatCurrency(revenueData.revenue),
            description: "",
            icon: DollarSign,
            iconClassName: "text-green-500",
          },
          {
            title: "Total Expenses",
            value: formatCurrency(expensesData.expenses),
            description: "",
            icon: TrendingDown,
            iconClassName: "text-red-500",
          },
          {
            title: "Net Profit",
            value: formatCurrency(profitData.netProfit),
            description: "",
            icon: TrendingUp,
            iconClassName: "text-green-500",
          },
          {
            title: "Budget Variance",
            value: "$0",
            description: "",
            icon: PieChartIcon,
            iconClassName: "text-blue-500",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <section aria-labelledby="overview-title">
      <h2
        id="overview-title"
        className="text-2xl font-semibold mb-4 text-foreground"
      >
        Financial Overview
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            iconClassName={metric.iconClassName}
          />
        ))}
      </div>
    </section>
  );
}

function formatCurrency(amount: number | string) {
  const parsed = typeof amount === "string" ? parseFloat(amount) : amount;
  return (
    parsed?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) ?? "$0"
  );
}
