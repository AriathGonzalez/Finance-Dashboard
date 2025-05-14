"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useState, useEffect } from "react";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-06-30");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/data/revenue/range?startDate=${startDate}&endDate=${endDate}`
        );
        const data = await res.json();
        const formatted = data.map((item: any) => ({
          month: item.month.trim(),
          revenue: Number(item.revenue),
        }));
        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching dynamic revenue:", err);
      }
    };

    fetchRevenue();
  }, [startDate, endDate]);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>January - June 2023</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${(value as number).toLocaleString()}`
                  }
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
