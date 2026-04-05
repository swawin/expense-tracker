import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      params: req.params,
      body: req.body,
      query: req.query
    });

    next();
  };
}
