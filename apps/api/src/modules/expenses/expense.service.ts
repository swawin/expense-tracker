import { StatusCodes } from "http-status-codes";
import { ExpenseModel } from "./expense.model";
import { ApiError } from "../../utils/apiError";
import { ReportModel } from "../reports/report.model";

export async function createExpense(payload: Record<string, unknown>) {
  const expense = await ExpenseModel.create(payload);
  return expense;
}

export async function listExpenses(filters: { status?: string }) {
  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;

  return ExpenseModel.find(query).sort({ date: -1, createdAt: -1 });
}

export async function getExpenseById(expenseId: string) {
  const expense = await ExpenseModel.findById(expenseId);
  if (!expense) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Expense not found");
  }
  return expense;
}

export async function updateExpense(expenseId: string, payload: Record<string, unknown>) {
  const expense = await getExpenseById(expenseId);

  if (expense.reportId) {
    const linkedReport = await ReportModel.findById(expense.reportId);
    if (linkedReport?.status === "submitted") {
      throw new ApiError(StatusCodes.CONFLICT, "Cannot edit expense in submitted report");
    }
  }

  Object.assign(expense, payload);
  await expense.save();
  return expense;
}

export async function deleteExpense(expenseId: string) {
  const expense = await getExpenseById(expenseId);

  if (expense.reportId) {
    const linkedReport = await ReportModel.findById(expense.reportId);
    if (linkedReport?.status === "submitted") {
      throw new ApiError(StatusCodes.CONFLICT, "Cannot delete expense from submitted report");
    }

    if (linkedReport) {
      linkedReport.expenseIds = linkedReport.expenseIds.filter((id) => id.toString() !== expenseId);
      linkedReport.totalAmountCents = await recalculateReportTotal(linkedReport._id.toString());
      await linkedReport.save();
    }
  }

  await expense.deleteOne();
}

export async function recalculateReportTotal(reportId: string) {
  const expenses = await ExpenseModel.find({ reportId });
  return expenses.reduce((sum, exp) => sum + exp.amountCents, 0);
}
