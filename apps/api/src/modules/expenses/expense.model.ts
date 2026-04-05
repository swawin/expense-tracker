import mongoose, { Schema, Document } from "mongoose";
import { ExpenseStatus } from "@expense-tracker/shared";

export interface ExpenseDocument extends Document {
  date: Date;
  merchant: string;
  amountCents: number;
  currency: string;
  category: string;
  description?: string;
  status: ExpenseStatus;
  reportId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<ExpenseDocument>(
  {
    date: { type: Date, required: true },
    merchant: { type: String, required: true, trim: true, maxlength: 120 },
    amountCents: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, default: "USD", maxlength: 3 },
    category: { type: String, required: true, trim: true, maxlength: 40 },
    description: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ["unreported", "reported"], default: "unreported" },
    reportId: { type: Schema.Types.ObjectId, ref: "Report", default: null }
  },
  { timestamps: true }
);

expenseSchema.index({ status: 1, date: -1 });
expenseSchema.index({ reportId: 1 });

export const ExpenseModel = mongoose.model<ExpenseDocument>("Expense", expenseSchema);
