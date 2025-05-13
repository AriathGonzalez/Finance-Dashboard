// budget-insights.ts
'use server';

/**
 * @fileOverview An AI agent for analyzing financial data and providing budget insights.
 *
 * - getBudgetInsights - A function that analyzes financial data, identifies potential risks/opportunities,
 *                        and recommends resource allocation.
 * - BudgetInsightsInput - The input type for the getBudgetInsights function.
 * - BudgetInsightsOutput - The return type for the getBudgetInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetInsightsInputSchema = z.object({
  financialData: z
    .string()
    .describe('Financial data in a structured format (e.g., JSON or CSV).'),
  currentBudget: z.string().describe('The current budget allocation.'),
  pastFinancialData: z
    .string()
    .optional()
    .describe('Past financial data for comparison (optional).'),
});
export type BudgetInsightsInput = z.infer<typeof BudgetInsightsInputSchema>;

const BudgetInsightsOutputSchema = z.object({
  risks: z
    .array(z.string())
    .describe('Potential budget risks identified in the financial data.'),
  opportunities: z
    .array(z.string())
    .describe('Potential budget opportunities identified in the financial data.'),
  recommendations: z
    .array(z.string())
    .describe('Specific recommendations for resource allocation to mitigate risks and leverage opportunities.'),
  summary: z.string().describe('A summary of the budget analysis.'),
});
export type BudgetInsightsOutput = z.infer<typeof BudgetInsightsOutputSchema>;

export async function getBudgetInsights(input: BudgetInsightsInput): Promise<BudgetInsightsOutput> {
  return budgetInsightsFlow(input);
}

const budgetInsightsPrompt = ai.definePrompt({
  name: 'budgetInsightsPrompt',
  input: {schema: BudgetInsightsInputSchema},
  output: {schema: BudgetInsightsOutputSchema},
  prompt: `You are a financial analyst expert. Analyze the provided financial data, current budget, and past financial data (if available) to identify potential budget risks and opportunities.

Financial Data:
{{financialData}}

Current Budget:
{{currentBudget}}

Past Financial Data (Optional):
{{#if pastFinancialData}}{{pastFinancialData}}{{else}}N/A{{/if}}

Based on your analysis, provide a list of potential risks, a list of potential opportunities, and specific recommendations for resource allocation to mitigate risks and leverage opportunities.  Also write a short summary.

Ensure the output is well-structured and easy to understand.

Risks:
Opportunities:
Recommendations:
Summary:`,
});

const budgetInsightsFlow = ai.defineFlow(
  {
    name: 'budgetInsightsFlow',
    inputSchema: BudgetInsightsInputSchema,
    outputSchema: BudgetInsightsOutputSchema,
  },
  async input => {
    const {output} = await budgetInsightsPrompt(input);
    return output!;
  }
);
