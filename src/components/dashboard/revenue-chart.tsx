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
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useEffect, useState, forwardRef } from "react";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const formatDateForAPI = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const RevenueChart = forwardRef<HTMLDivElement>((_, ref) => {
  const [chartData, setChartData] = useState<
    Array<{ month: string; revenue: number }>
  >([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setStartDate(new Date("2023-01-01"));
    setEndDate(new Date("2023-06-30"));
  }, []);

  useEffect(() => {
    if (!isClient || !startDate || !endDate) {
      setChartData([]);
      return;
    }

    const fetchRevenue = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3001/data/revenue/range?startDate=${formatDateForAPI(
            startDate
          )}&endDate=${formatDateForAPI(endDate)}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${res.status}`
          );
        }
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          month: item.month ? item.month.trim() : "Unknown",
          revenue: Number(item.revenue) || 0,
        }));
        setChartData(formatted);
      } catch (err: any) {
        console.error("Error fetching revenue:", err);
        setError(err.message || "Failed to fetch revenue data.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenue();
  }, [startDate, endDate, isClient]);

  const cardDescription = () => {
    if (!isClient || !startDate || !endDate) return "Loading...";
    return `${format(startDate, "MMMM yyyy")} - ${format(
      endDate,
      "MMMM yyyy"
    )}`;
  };

  return (
    <div ref={ref}>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>{cardDescription()}</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="start-date-revenue">Start Date</Label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Start Date"
                disabled={(date) =>
                  isClient && endDate ? date > endDate : false
                }
                className="w-full"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="end-date-revenue">End Date</Label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="End Date"
                disabled={(date) =>
                  isClient && startDate ? date < startDate : false
                }
                className="w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-center text-muted-foreground">
              Loading chart data...
            </p>
          )}
          {error && <p className="text-center text-destructive">{error}</p>}
          {!isLoading && !error && chartData.length === 0 && isClient && (
            <p className="text-center text-muted-foreground">
              No data available for the selected range.
            </p>
          )}
          {!isLoading && !error && chartData.length > 0 && (
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
                  tickFormatter={(value) =>
                    typeof value === "string" ? value.slice(0, 3) : ""
                  }
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
          )}
        </CardContent>
      </Card>
    </div>
  );
});

RevenueChart.displayName = "RevenueChart";
