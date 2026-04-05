import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/apiError";
import { ExpenseModel } from "../expenses/expense.model";
import { ReportModel } from "./report.model";

export async function createReport(payload: Record<string, unknown>) {
  return ReportModel.create(payload);
}

export async function listReports() {
  return ReportModel.find().sort({ createdAt: -1 });
}

export async function getReportById(reportId: string) {
  const report = await ReportModel.findById(reportId).lean();
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");

  const expenses = await ExpenseModel.find({ reportId }).sort({ date: -1 });
  return { ...report, expenses };
}

export async function updateReport(reportId: string, payload: Record<string, unknown>) {
  const report = await ReportModel.findById(reportId);
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
  if (report.status === "submitted") throw new ApiError(StatusCodes.CONFLICT, "Submitted reports are read-only");

  Object.assign(report, payload);
  if (payload.status === "draft") {
    report.status = "draft";
    report.submittedAt = null;
  }
  await report.save();
  return report;
}

export async function addExpensesToReport(reportId: string, expenseIds: string[]) {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const report = await ReportModel.findById(reportId).session(session);
      if (!report) throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
      if (report.status === "submitted") throw new ApiError(StatusCodes.CONFLICT, "Cannot modify submitted report");

      const expenses = await ExpenseModel.find({ _id: { $in: expenseIds } }).session(session);
      if (expenses.length !== expenseIds.length) throw new ApiError(StatusCodes.NOT_FOUND, "One or more expenses not found");

      const invalid = expenses.find((exp) => exp.status === "reported" || exp.reportId);
      if (invalid) throw new ApiError(StatusCodes.CONFLICT, "Reported expense cannot be added to another report");

      for (const expense of expenses) {
        expense.status = "reported";
        expense.reportId = report._id as mongoose.Types.ObjectId;
        await expense.save({ session });
      }

      const uniqueIds = new Set([...report.expenseIds.map((id) => id.toString()), ...expenseIds]);
      report.expenseIds = [...uniqueIds].map((id) => new mongoose.Types.ObjectId(id));

      const total = await ExpenseModel.aggregate([
        { $match: { reportId: report._id } },
        { $group: { _id: null, total: { $sum: "$amountCents" } } }
      ]).session(session);

      report.totalAmountCents = total[0]?.total ?? 0;
      await report.save({ session });
      return report;
    });
  } finally {
    await session.endSession();
  }
}

export async function removeExpenseFromReport(reportId: string, expenseId: string) {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const report = await ReportModel.findById(reportId).session(session);
      if (!report) throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
      if (report.status === "submitted") throw new ApiError(StatusCodes.CONFLICT, "Cannot modify submitted report");

      const expense = await ExpenseModel.findById(expenseId).session(session);
      if (!expense) throw new ApiError(StatusCodes.NOT_FOUND, "Expense not found");
      if (expense.reportId?.toString() !== reportId) {
        throw new ApiError(StatusCodes.CONFLICT, "Expense does not belong to this report");
      }

      expense.status = "unreported";
      expense.reportId = null;
      await expense.save({ session });

      report.expenseIds = report.expenseIds.filter((id) => id.toString() !== expenseId);

      const total = await ExpenseModel.aggregate([
        { $match: { reportId: report._id } },
        { $group: { _id: null, total: { $sum: "$amountCents" } } }
      ]).session(session);

      report.totalAmountCents = total[0]?.total ?? 0;
      await report.save({ session });
      return report;
    });
  } finally {
    await session.endSession();
  }
}

export async function submitReport(reportId: string) {
  const report = await ReportModel.findById(reportId);
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
  if (report.status === "submitted") throw new ApiError(StatusCodes.CONFLICT, "Report already submitted");

  report.status = "submitted";
  report.submittedAt = new Date();
  await report.save();
  return report;
}
