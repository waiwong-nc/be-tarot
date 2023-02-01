import { NextFunction, Request, Response } from "express";
import { patchEntry } from "../models/patchEntry";


// PATCH /api/users/:entry_id
export const patchEntryById = (req: Request, res: Response, next: NextFunction) => {
  const { entry_id } = req.params;
  const editedEntry = req.body
patchEntry(entry_id, editedEntry)
  .then((entry) => {
    res.status(200).send({entry});
  })
  .catch((err: any) => {
    next(err);
  });
};