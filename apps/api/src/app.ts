import express from "express";
import cors from "cors";
import { expenseRoutes } from "./modules/expenses/expense.routes";
import { reportRoutes } from "./modules/reports/report.routes";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ data: { status: "ok" } });
  });

  app.use("/api/v1/expenses", expenseRoutes);
  app.use("/api/v1/reports", reportRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
