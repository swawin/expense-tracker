import { z } from "zod";

const createExpenseBody = z.object({
  date: z.string().datetime(),
  merchant: z.string().min(1).max(120),
  amountCents: z.number().int().positive(),
  currency: z.string().length(3).default("USD"),
  category: z.string().min(1).max(40),
  description: z.string().max(500).optional(),
  reportId: z.string().length(24).nullable().optional()
});

const updateExpenseBody = createExpenseBody.partial();

export const createExpenseSchema = z.object({ body: createExpenseBody, params: z.object({}), query: z.object({}) });
export const updateExpenseSchema = z.object({
  body: updateExpenseBody,
  params: z.object({ expenseId: z.string().length(24) }),
  query: z.object({})
});

export const expenseIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({ expenseId: z.string().length(24) }),
  query: z.object({})
});
