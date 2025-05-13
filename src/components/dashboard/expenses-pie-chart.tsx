"use client"

import { Pie, PieChart, Tooltip, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { category: "Salaries", expenses: 45000, fill: "var(--color-salaries)" },
  { category: "Marketing", expenses: 20000, fill: "var(--color-marketing)" },
  { category: "Operations", expenses: 15000, fill: "var(--color-operations)" },
  { category: "R&D", expenses: 10000, fill: "var(--color-rnd)" },
  { category: "Other", expenses: 5000, fill: "var(--color-other)" },
]

const chartConfig = {
  expenses: {
    label: "Expenses",
  },
  salaries: {
    label: "Salaries",
    color: "hsl(var(--chart-1))",
  },
  marketing: {
    label: "Marketing",
    color: "hsl(var(--chart-2))",
  },
  operations: {
    label: "Operations",
    color: "hsl(var(--chart-3))",
  },
  rnd: {
    label: "R&D",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ExpensesPieChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
        <CardDescription>Current Month</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Tooltip 
              cursor={false} 
              content={<ChartTooltipContent 
                hideLabel 
                formatter={(value, name, item) => `${item.payload.category}: $${(value as number).toLocaleString()}`}
              />} 
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
  )
}
