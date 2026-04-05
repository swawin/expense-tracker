import { Request, Response, NextFunction } from "express";
import { ok } from "../../utils/apiResponse";
import {
  addExpensesToReport,
  createReport,
  getReportById,
  listReports,
  removeExpenseFromReport,
  submitReport,
  updateReport
} from "./report.service";

export async function createReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await createReport(req.body);
    res.status(201).json(ok(report));
  } catch (error) {
    next(error);
  }
}

export async function listReportsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const reports = await listReports();
    res.json(ok(reports));
  } catch (error) {
    next(error);
  }
}

export async function getReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await getReportById(req.params.reportId);
    res.json(ok(report));
  } catch (error) {
    next(error);
  }
}

export async function updateReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await updateReport(req.params.reportId, req.body);
    res.json(ok(report));
  } catch (error) {
    next(error);
  }
}

export async function addExpensesToReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await addExpensesToReport(req.params.reportId, req.body.expenseIds);
    res.json(ok(report));
  } catch (error) {
    next(error);
  }
}

export async function removeExpenseFromReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await removeExpenseFromReport(req.params.reportId, req.params.expenseId);
    res.json(ok(report));
  } catch (error) {
    next(error);
  }
}

export async function submitReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await submitReport(req.params.reportId);
    res.json(ok(report));
  } catch (error) {
    next(error);
  }
}
