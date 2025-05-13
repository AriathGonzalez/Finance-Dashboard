"use client";

import { useState, useTransition } from 'react';
import { getBudgetInsights, type BudgetInsightsOutput } from '@/ai/flows/budget-insights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Bot, AlertTriangle, CheckCircle, ListChecks, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast"

export function AiInsightsSection() {
  const [financialData, setFinancialData] = useState('{\n  "income_streams": [\n    {"source": "Product A Sales", "amount": 500000, "trend": "stable"},\n    {"source": "Service B Subscriptions", "amount": 300000, "trend": "increasing"},\n    {"source": "Product C Sales", "amount": 150000, "trend": "decreasing"}\n  ],\n  "expenses": [\n    {"category": "Salaries", "amount": 200000, "priority": "high"},\n    {"category": "Marketing", "amount": 100000, "priority": "medium", "roi_potential": "high"},\n    {"category": "Operational Costs", "amount": 150000, "priority": "high"},\n    {"category": "R&D", "amount": 50000, "priority": "medium", "innovation_potential": "high"}\n  ]\n}');
  const [currentBudget, setCurrentBudget] = useState('{\n  "allocations": [\n    {"department": "Sales", "budget": 250000},\n    {"department": "Marketing", "budget": 120000},\n    {"department": "Operations", "budget": 180000},\n    {"department": "R&D", "budget": 60000}\n  ]\n}');
  const [insights, setInsights] = useState<BudgetInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = () => {
    setError(null);
    setInsights(null);
    startTransition(async () => {
      try {
        if (!financialData.trim() || !currentBudget.trim()) {
          setError("Financial data and current budget cannot be empty.");
          toast({ title: "Error", description: "Please fill in financial data and current budget.", variant: "destructive" });
          return;
        }
        const result = await getBudgetInsights({ financialData, currentBudget });
        setInsights(result);
        toast({ title: "Insights Generated", description: "AI budget insights successfully retrieved.", className: "bg-green-500 text-white" });
      } catch (e) {
        console.error("Error fetching budget insights:", e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        setError(errorMessage);
        toast({ title: "Error", description: `Failed to generate insights: ${errorMessage}`, variant: "destructive" });
      }
    });
  };

  return (
    <section aria-labelledby="ai-insights-title" className="mt-8">
      <h2 id="ai-insights-title" className="text-2xl font-semibold mb-4 text-foreground flex items-center">
        <Bot className="mr-2 h-6 w-6 text-primary" /> AI-Powered Budget Insights
      </h2>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Analyze Financial Data</CardTitle>
          <CardDescription>
            Provide financial data and current budget to get AI-driven insights, identify risks/opportunities, and receive resource allocation recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="financialData" className="mb-1 block">Financial Data (JSON or CSV format)</Label>
            <Textarea
              id="financialData"
              value={financialData}
              onChange={(e) => setFinancialData(e.target.value)}
              placeholder="Enter financial data..."
              rows={8}
              className="font-mono text-sm"
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="currentBudget" className="mb-1 block">Current Budget (JSON or CSV format)</Label>
            <Textarea
              id="currentBudget"
              value={currentBudget}
              onChange={(e) => setCurrentBudget(e.target.value)}
              placeholder="Enter current budget..."
              rows={5}
              className="font-mono text-sm"
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Insights...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Get Insights
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {isPending && (
        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {error && (
         <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {insights && !isPending && (
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" />Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{insights.summary}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive" />Potential Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {insights.risks.map((risk, index) => <li key={index}>{risk}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" />Potential Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {insights.opportunities.map((opportunity, index) => <li key={index}>{opportunity}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-accent" />Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {insights.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
