import { NextFunction, Request, Response } from "express";
import entries from "../db/data/entries";
import {
  selectAllEntries,
  selectEntryById,
  insertEntry,
  selectAllEntriesById,
} from "../models/entries";
import {requireLoginError} from "../middlewares/is-auth";
import { validationResult } from "express-validator";


class CustomerError extends Error {
  code: number;
  constructor(message = "", code: number) {
    super(message);
    this.code = code;
  }
}


// GET /api/getEntries
export const getEntries = (req: Request, res: Response, next: NextFunction) => {
  let userId;
  if (!req.userId) {
    next(requireLoginError);
  } else {
    userId = req.userId;
  }
  
  selectAllEntriesById(userId)
    .then((entries) => {
      res.status(200).send({ entries });
    })
    .catch((err: any) => {
      next(err);
    });
};

// GET /api/getEntries
export const getEntryById = (req: Request, res: Response, next: NextFunction) => {
 
  let userId;
  if (!req.userId) {
    next(requireLoginError);
  } else {
    userId = req.userId;
  }

  const { entry_id } = req.params;

  selectEntryById(entry_id, userId)
  .then((entries) => {
    console.log(entries,"<< entries")
    const tarot_card_id= JSON.parse( entries[0].tarot_card_id)
    res.status(200).send({entries: [{ ... entries[0],  tarot_card_id}]});
  })
  .catch((err: any) => {
    next(err);
  });
};

// POST /api/postEntries - entries.ts
export const postEntry = (req: Request, res: Response, next: NextFunction) => {

   
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new CustomerError(message, 422);
      next(err);
    }

    let userId;
    if (!req.userId) {
      next(requireLoginError);
    } else {
      userId = req.userId;
    }

    const entryBody = req.body
    insertEntry( userId, entryBody )
      .then((entries) => {
        const tarot_card_id = JSON.parse(entries.tarot_card_id);
        res.status(201).send({ entries: [{ ...entries, tarot_card_id }] });
      })
      .catch((err: any) => {
        next(err);
      });
  };

  //
