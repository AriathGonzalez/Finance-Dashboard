
"use client";

import { Pie, PieChart, Tooltip, Legend, Cell } from "recharts";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getMonth, getYear } from "date-fns"; // Removed 'format' as it's not used

const categoryLabels = [
  "Payroll",
  "Other Ops",
  "Contracted Services",
  "Debt Services",
  "Supplies & Materials",
  "Capital Outlay",
];

const categoryConfigKeys = [
  "payroll",
  "otherOps",
  "contractedServices",
  "debtServices",
  "suppliesMaterials",
  "capitalOutlay",
] as const; // Added 'as const'

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
    color: "hsl(var(--chart-4))",
  },
  capitalOutlay: {
    label: "Capital Outlay",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const months = [
  { value: 1, label: "January" }, { value: 2, label: "February" },
  { value: 3, label: "March" }, { value: 4, label: "April" },
  { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" },
  { value: 9, label: "September" }, { value: 10, label: "October" },
  { value: 11, label: "November" }, { value: 12, label: "December" },
];

export function ExpensesPieChart() {
  const [chartData, setChartData] = useState<
    { category: string; expenses: number; fill: string }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentDate = new Date();
    setSelectedMonth(getMonth(currentDate) + 1); // date-fns getMonth is 0-indexed
    setSelectedYear(getYear(currentDate));
  }, []);

  useEffect(() => {
    if (!isClient || typeof selectedMonth === 'undefined' || typeof selectedYear === 'undefined') {
      setChartData([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoints = [
          "get-payroll", "get-other", "get-contracted-services",
          "get-debt-services", "get-supplies-materials", "get-capital-outlay"
        ];
        const promises = endpoints.map(endpoint =>
          fetch(`http://localhost:3001/expenses/${endpoint}?month=${selectedMonth}&year=${selectedYear}`)
        );

        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map(async (res, index) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: `HTTP error ${res.status} for ${endpoints[index]}`}));
            console.error(`Failed to fetch ${endpoints[index]}:`, errorData.message || errorData.error);
            return { [Object.keys(chartConfig)[index+1]]: [{ total_expenses: 0 }] }; 
          }
          return res.json();
        }));
        
        const pieData = results.map((res, index) => {
          const categoryKey = categoryConfigKeys[index]; 
          const responseKey = Object.keys(res)[0];
          const totalExpenses = Math.abs(parseFloat(res?.[responseKey]?.[0]?.total_expenses ?? 0));
          
          return {
            category: categoryLabels[index],
            expenses: totalExpenses,
            fill: chartConfig[categoryKey]?.color || "hsl(var(--muted))",
          };
        });

        setChartData(pieData.filter(item => item.expenses > 0)); 
      } catch (err: any) {
        console.error("Failed to fetch expense data:", err);
        setError(err.message || "An unexpected error occurred while fetching expense data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, isClient]);

  const cardDescription = () => {
    if (!isClient || typeof selectedMonth === 'undefined' || typeof selectedYear === 'undefined') return "Loading...";
    const monthLabel = months.find(m => m.value === selectedMonth)?.label || "";
    return `Expenses for ${monthLabel} ${selectedYear}`;
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
          Expense Categories
        </CardTitle>
        <CardDescription>{cardDescription()}</CardDescription>
        {isClient && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="month-select-expenses">Month</Label>
              <Select
                value={selectedMonth?.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger id="month-select-expenses">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="year-input-expenses">Year</Label>
              <Input
                id="year-input-expenses"
                type="number"
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                placeholder="Year"
                disabled={isLoading}
                min="2000" 
                max={new Date().getFullYear() + 5} 
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {isLoading && <p className="text-center text-muted-foreground">Loading chart data...</p>}
        {error && <p className="text-center text-destructive">{error}</p>}
        {!isLoading && !error && chartData.length === 0 && isClient && (
          <p className="text-center text-muted-foreground">No expense data available for the selected period.</p>
        )}
        {!isLoading && !error && chartData.length > 0 && (
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
                    formatter={(value, name, props) => {
                       const originalItem = props.payload as any;
                       return `${originalItem.category}: $${(value as number).toLocaleString()}`;
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="expenses"
                nameKey="category" 
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={2}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} name={entry.category} />
                ))}
              </Pie>
              <Legend content={<ChartLegendContent nameKey="category" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
