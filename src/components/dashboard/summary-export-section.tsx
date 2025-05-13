"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function SummaryExportSection() {
  const { toast } = useToast();

  const handleExport = () => {
    // In a real application, this would trigger PDF generation and download.
    // For now, we'll just show a toast message.
    toast({
      title: "Export Initiated (Mock)",
      description: "Summary charts would be generated and exported as PDF here.",
    });
    console.log("PDF export initiated (mock).");
  };

  return (
    <section aria-labelledby="summary-export-title" className="mt-8">
      <h2 id="summary-export-title" className="text-2xl font-semibold mb-4 text-foreground">
        Export Summary
      </h2>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Board Meeting Summary</CardTitle>
          <CardDescription>
            Generate and export summary charts as a PDF document, ready for your board meetings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Click the button below to generate a PDF containing key financial summaries and charts.
            (Note: This is a placeholder for the actual PDF generation functionality).
          </p>
          <Button onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Summary PDF
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
