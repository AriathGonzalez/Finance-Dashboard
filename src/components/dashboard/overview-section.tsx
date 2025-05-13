import { DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { MetricCard } from './metric-card';

export function OverviewSection() {
  // Mock data for demonstration
  const metrics = [
    { title: "Total Revenue", value: "$1,250,340", description: "+20.1% from last month", icon: DollarSign, iconClassName: "text-green-500" },
    { title: "Total Expenses", value: "$780,120", description: "+12.5% from last month", icon: TrendingDown, iconClassName: "text-red-500" },
    { title: "Net Profit", value: "$470,220", description: "+35.2% from last month", icon: TrendingUp, iconClassName: "text-green-500" },
    { title: "Budget Variance", value: "+$50,000", description: "Favorable variance", icon: PieChartIcon, iconClassName: "text-blue-500" },
  ];

  return (
    <section aria-labelledby="overview-title">
      <h2 id="overview-title" className="text-2xl font-semibold mb-4 text-foreground">Financial Overview</h2>
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
