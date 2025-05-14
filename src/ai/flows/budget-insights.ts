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
  prompt: `You are an expert financial analyst AI. Your task is to meticulously analyze the provided financial data, current budget allocation, and any available past financial data.
Your goal is to identify:
1.  **Potential Budget Risks:** These could be areas of overspending, underperforming revenue streams, inefficient cost structures, or external factors suggested by the data. Be specific about why each item is a risk.
2.  **Potential Budget Opportunities:** These could include areas for cost savings, high-performing revenue streams to invest more in, potential for new revenue generation, or efficiencies that can be gained. Explain the upside of each opportunity.
3.  **Actionable Recommendations:** For each identified risk and opportunity, provide concrete, actionable recommendations for resource allocation. These should be specific (e.g., "Reallocate X% of marketing budget from Product C to Product A" rather than "Improve marketing"). Consider how the current budget could be adjusted.
4.  **Concise Summary:** Provide an overall summary of the financial health and key takeaways from your analysis.

When analyzing, pay attention to:
- Trends evident in the financial data (e.g., increasing/decreasing income or expenses, changes in proportions).
- Discrepancies or alignments between the financial data (actuals/performance) and the current budget.
- The potential impact and urgency of identified risks and opportunities.

Provided Data:

Current Financial Data:
{{{financialData}}}

Current Budget Allocation:
{{{currentBudget}}}

{{#if pastFinancialData}}
Past Financial Data (for trend analysis and comparison):
{{{pastFinancialData}}}
{{else}}
(No past financial data provided for comparison)
{{/if}}

Structure your output clearly under the following headings: Summary, Potential Risks, Potential Opportunities, Recommendations.
Be professional, insightful, and ensure your analysis is directly based on the data provided.`,
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

