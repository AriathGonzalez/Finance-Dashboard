import { MainLayout } from '@/components/layout/main-layout';
import { OverviewSection } from '@/components/dashboard/overview-section';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { AiInsightsSection } from '@/components/dashboard/ai-insights-section';
import { SqlChatbotSection } from '@/components/dashboard/sql-chatbot-section';
import { SummaryExportSection } from '@/components/dashboard/summary-export-section';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <OverviewSection />
        <Separator />
        <ChartsSection />
        <Separator />
        <AiInsightsSection />
        <Separator />
        <SqlChatbotSection />
        <Separator />
        <SummaryExportSection />
      </div>
    </MainLayout>
  );
}
