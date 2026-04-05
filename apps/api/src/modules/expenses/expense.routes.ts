import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { createExpenseHandler, deleteExpenseHandler, getExpenseHandler, listExpensesHandler, updateExpenseHandler } from "./expense.controller";
import { createExpenseSchema, expenseIdParamSchema, updateExpenseSchema } from "./expense.validation";

export const expenseRoutes = Router();

expenseRoutes.post("/", validate(createExpenseSchema), createExpenseHandler);
expenseRoutes.get("/", listExpensesHandler);
expenseRoutes.get("/:expenseId", validate(expenseIdParamSchema), getExpenseHandler);
expenseRoutes.patch("/:expenseId", validate(updateExpenseSchema), updateExpenseHandler);
expenseRoutes.delete("/:expenseId", validate(expenseIdParamSchema), deleteExpenseHandler);
