import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/expense_tracker"
};
