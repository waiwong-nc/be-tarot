import { NextFunction, Request, Response } from "express";
import { selectAllEntries } from "../models/entries";



// GET /api/getEntries
export const getEntries = (req: Request, res: Response, next: NextFunction) => {
  selectAllEntries()
    .then((entries) => {
      res.status(200).send({ entries });
    })
    .catch((err: any) => {
      next(err);
    });
};
