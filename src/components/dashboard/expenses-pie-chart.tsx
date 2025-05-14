"use client";

import { Pie, PieChart, Tooltip, Legend } from "recharts";
import { PieChartIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useEffect, useState } from "react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const categoryLabels = [
  "Payroll",
  "Other Ops",
  "Contracted Services",
  "Debt Services",
  "Supplies & Materials",
  "Capital Outlay",
];

const chartConfig = {
  expenses: {
    label: "Expenses",
  },
  payroll: {
    label: "Payroll",
    color: "hsl(var(--chart-1))",
  },
  otherOps: {
    label: "Other Ops",
    color: "hsl(var(--chart-2))",
  },
  contractedServices: {
    label: "Contracted Services",
    color: "hsl(var(--chart-3))",
  },
  debtServices: {
    label: "Debt Services",
    color: "hsl(var(--chart-4))",
  },
  suppliesMaterials: {
    label: "Supplies & Materials",
    color: "hs1(var(--chart-4))",
  },
  capitalOutlay: {
    label: "Capital Outlay",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function ExpensesPieChart() {
  const [chartData, setChartData] = useState<
    { category: string; expenses: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:3001/expenses/get-payroll?month=3&year=2023"),
          fetch("http://localhost:3001/expenses/get-other?month=3&year=2023"),
          fetch(
            "http://localhost:3001/expenses/get-contracted-services?month=3&year=2023"
          ),
          fetch(
            "http://localhost:3001/expenses/get-debt-services?month=3&year=2023"
          ),
          fetch(
            "http://localhost:3001/expenses/get-supplies-materials?month=3&year=2023"
          ),
          fetch(
            "http://localhost:3001/expenses/get-capital-outlay?month=3&year=2023"
          ),
        ]);

        const results = await Promise.all(responses.map((res) => res.json()));

        const pieData = results.map((res, index) => ({
          category: categoryLabels[index],
          expenses: Math.abs(
            res?.[Object.keys(res)[0]]?.[0]?.total_expenses ?? 0
          ),
        }));

        setChartData(pieData);
      } catch (err) {
        console.error("Failed to fetch expense data:", err);
      }
    };

    fetchData();
  }, []);
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
          Expense Categories
        </CardTitle>
        <CardDescription>Current Month</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) =>
                    `${item.payload.category}: $${(
                      value as number
                    ).toLocaleString()}`
                  }
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="expenses"
              nameKey="category"
              innerRadius={60}
              strokeWidth={2}
            />
            <Legend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
