import { Request, Response, NextFunction } from "express";
import { ok } from "../../utils/apiResponse";
import { createExpense, deleteExpense, getExpenseById, listExpenses, updateExpense } from "./expense.service";

export async function createExpenseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await createExpense(req.body);
    res.status(201).json(ok(expense));
  } catch (error) {
    next(error);
  }
}

export async function listExpensesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const expenses = await listExpenses({ status: req.query.status as string | undefined });
    res.json(ok(expenses));
  } catch (error) {
    next(error);
  }
}

export async function getExpenseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await getExpenseById(req.params.expenseId);
    res.json(ok(expense));
  } catch (error) {
    next(error);
  }
}

export async function updateExpenseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await updateExpense(req.params.expenseId, req.body);
    res.json(ok(expense));
  } catch (error) {
    next(error);
  }
}

export async function deleteExpenseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteExpense(req.params.expenseId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
