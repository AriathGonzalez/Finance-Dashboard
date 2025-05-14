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
import { ExpensesPieChart } from "./expenses-pie-chart";

export function SummaryExportSection() {
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const expensesRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    const overviewElement = overviewRef.current;
    const chartElement = chartRef.current;
    const expensesElement = expensesRef.current;

    if (!overviewElement || !chartElement || !expensesElement) {
      toast({ title: "Error", description: "Content not ready for export." });
      return;
    }

    try {
      const container = document.createElement("div");
      const clonedOverview = overviewElement.cloneNode(true) as HTMLElement;
      const clonedChart = chartElement.cloneNode(true) as HTMLElement;
      const clonedExpenses = expensesElement.cloneNode(true) as HTMLElement;

      container.style.padding = "20px"; // Add some padding for better PDF appearance
      container.style.background = "white"; // Ensure a background for the canvas
      container.appendChild(clonedOverview);
      // Add some space between overview and chart
      const spacer = document.createElement("div");
      spacer.style.height = "20px";
      container.appendChild(spacer);
      container.appendChild(clonedChart);
      container.appendChild(clonedExpenses);
      // Temporarily append to body to ensure rendering if needed, then remove
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      document.body.removeChild(container); // Clean up the temporary container

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      // Calculate aspect ratio to fit image into PDF page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const newImgWidth = imgWidth * ratio;
      const newImgHeight = imgHeight * ratio;

      // Center the image on the PDF page (optional)
      const xOffset = (pdfWidth - newImgWidth) / 2;
      const yOffset = 10; // Add some margin from top

      pdf.addImage(imgData, "PNG", xOffset, yOffset, newImgWidth, newImgHeight);
      pdf.save("board-summary.pdf");

      toast({
        title: "PDF Exported",
        description: "The summary has been downloaded.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        variant: "destructive",
      });
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
          {/* Content to be exported */}
          <div className="flex flex-col gap-6 mb-6">
            <OverviewSection ref={overviewRef} />
            <RevenueChart ref={chartRef} />
            <ExpensesPieChart ref={expensesRef} />
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
