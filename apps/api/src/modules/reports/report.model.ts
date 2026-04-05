import mongoose, { Schema, Document } from "mongoose";
import { ReportStatus } from "@expense-tracker/shared";

export interface ReportDocument extends Document {
  title: string;
  description?: string;
  status: ReportStatus;
  submittedAt?: Date | null;
  expenseIds: mongoose.Types.ObjectId[];
  totalAmountCents: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ["draft", "submitted"], default: "draft" },
    submittedAt: { type: Date, default: null },
    expenseIds: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
    totalAmountCents: { type: Number, default: 0 },
    currency: { type: String, required: true, default: "USD", maxlength: 3 }
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });

export const ReportModel = mongoose.model<ReportDocument>("Report", reportSchema);
