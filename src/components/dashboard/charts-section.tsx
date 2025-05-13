import { RevenueChart } from './revenue-chart';
import { ExpensesPieChart } from './expenses-pie-chart';

export function ChartsSection() {
  return (
    <section aria-labelledby="charts-title" className="mt-8">
      <h2 id="charts-title" className="text-2xl font-semibold mb-4 text-foreground">Data Visualizations</h2>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <RevenueChart />
        <ExpensesPieChart />
      </div>
    </section>
  );
}
