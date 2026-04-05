import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  addExpensesToReportHandler,
  createReportHandler,
  getReportHandler,
  listReportsHandler,
  removeExpenseFromReportHandler,
  submitReportHandler,
  updateReportHandler
} from "./report.controller";
import {
  addExpensesToReportSchema,
  createReportSchema,
  removeExpenseSchema,
  reportIdSchema,
  updateReportSchema
} from "./report.validation";

export const reportRoutes = Router();

reportRoutes.post("/", validate(createReportSchema), createReportHandler);
reportRoutes.get("/", listReportsHandler);
reportRoutes.get("/:reportId", validate(reportIdSchema), getReportHandler);
reportRoutes.patch("/:reportId", validate(updateReportSchema), updateReportHandler);
reportRoutes.post("/:reportId/expenses", validate(addExpensesToReportSchema), addExpensesToReportHandler);
reportRoutes.delete("/:reportId/expenses/:expenseId", validate(removeExpenseSchema), removeExpenseFromReportHandler);
reportRoutes.post("/:reportId/submit", validate(reportIdSchema), submitReportHandler);
