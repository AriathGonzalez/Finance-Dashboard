"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { RevenueChart } from "./revenue-chart";
import { OverviewSection } from "./overview-section";

export function SummaryExportSection() {
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 10, pageWidth, pdfHeight);
      pdf.save("board-summary.pdf");

      toast({
        title: "PDF Exported",
        description: "The summary has been downloaded.",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate PDF." });
      console.error("PDF export error:", error);
    }
  };

  return (
    <section aria-labelledby="summary-export-title" className="mt-8">
      <h2
        id="summary-export-title"
        className="text-2xl font-semibold mb-4 text-foreground"
      >
        Export Summary
      </h2>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Board Meeting Summary</CardTitle>
          <CardDescription>
            Generate and export summary charts as a PDF document, ready for your
            board meetings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <OverviewSection ref={overviewRef} />
            <RevenueChart ref={chartRef} />
          </div>
          <Button onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Summary PDF
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
