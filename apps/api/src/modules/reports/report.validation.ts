import { z } from "zod";

const createReportBody = z.object({
  title: z.string().min(1).max(140),
  description: z.string().max(500).optional(),
  currency: z.string().length(3).default("USD")
});

const updateReportBody = z.object({
  title: z.string().min(1).max(140).optional(),
  description: z.string().max(500).optional(),
  status: z.literal("draft").optional()
});

export const createReportSchema = z.object({ body: createReportBody, params: z.object({}), query: z.object({}) });
export const updateReportSchema = z.object({
  body: updateReportBody,
  params: z.object({ reportId: z.string().length(24) }),
  query: z.object({})
});
export const reportIdSchema = z.object({
  body: z.object({}),
  params: z.object({ reportId: z.string().length(24) }),
  query: z.object({})
});
export const addExpensesToReportSchema = z.object({
  body: z.object({ expenseIds: z.array(z.string().length(24)).min(1) }),
  params: z.object({ reportId: z.string().length(24) }),
  query: z.object({})
});
export const removeExpenseSchema = z.object({
  body: z.object({}),
  params: z.object({ reportId: z.string().length(24), expenseId: z.string().length(24) }),
  query: z.object({})
});
