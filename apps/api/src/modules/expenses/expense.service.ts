import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { ExpenseModel } from "./expense.model";
import { ApiError } from "../../utils/apiError";
import { ReportModel } from "../reports/report.model";

export async function createExpense(payload: Record<string, unknown>) {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const reportId = typeof payload.reportId === "string" ? payload.reportId : null;
      const createPayload = { ...payload } as Record<string, unknown>;

      if (reportId) {
        const report = await ReportModel.findById(reportId).session(session);
        if (!report) throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
        if (report.status === "submitted") throw new ApiError(StatusCodes.CONFLICT, "Cannot add expense to submitted report");

        createPayload.status = "reported";
        createPayload.reportId = report._id;
      } else {
        createPayload.status = "unreported";
        createPayload.reportId = null;
      }

      const [expense] = await ExpenseModel.create([createPayload], { session });

      if (reportId) {
        await ReportModel.findByIdAndUpdate(
          reportId,
          {
            $addToSet: { expenseIds: expense._id },
            $inc: { totalAmountCents: expense.amountCents }
          },
          { session }
        );
      }

      return expense;
    });
  } finally {
    await session.endSession();
  }
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
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const expense = await ExpenseModel.findById(expenseId).session(session);
      if (!expense) throw new ApiError(StatusCodes.NOT_FOUND, "Expense not found");

      const originalAmount = expense.amountCents;
      const originalReportId = expense.reportId?.toString() ?? null;

      if (originalReportId) {
        const linkedReport = await ReportModel.findById(originalReportId).session(session);
        if (linkedReport?.status === "submitted") {
          throw new ApiError(StatusCodes.CONFLICT, "Cannot edit expense in submitted report");
        }
      }

      const nextReportId = payload.reportId === undefined ? originalReportId : (typeof payload.reportId === "string" ? payload.reportId : null);

      if (nextReportId) {
        const nextReport = await ReportModel.findById(nextReportId).session(session);
        if (!nextReport) throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
        if (nextReport.status === "submitted") throw new ApiError(StatusCodes.CONFLICT, "Cannot move expense to submitted report");
      }

      Object.assign(expense, payload);
      expense.reportId = nextReportId ? new mongoose.Types.ObjectId(nextReportId) : null;
      expense.status = nextReportId ? "reported" : "unreported";
      await expense.save({ session });

      if (originalReportId && originalReportId !== nextReportId) {
        await ReportModel.findByIdAndUpdate(
          originalReportId,
          { $pull: { expenseIds: expense._id }, $inc: { totalAmountCents: -originalAmount } },
          { session }
        );
      }

      if (nextReportId && originalReportId !== nextReportId) {
        await ReportModel.findByIdAndUpdate(
          nextReportId,
          { $addToSet: { expenseIds: expense._id }, $inc: { totalAmountCents: expense.amountCents } },
          { session }
        );
      }

      if (originalReportId && originalReportId === nextReportId && originalAmount !== expense.amountCents) {
        await ReportModel.findByIdAndUpdate(
          originalReportId,
          { $inc: { totalAmountCents: expense.amountCents - originalAmount } },
          { session }
        );
      }

      return expense;
    });
  } finally {
    await session.endSession();
  }
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
