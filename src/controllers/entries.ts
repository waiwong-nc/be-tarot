import { NextFunction, Request, Response } from "express";
import { selectAllEntries, selectEntryById, insertEntry } from "../models/entries";

//selectEntryById
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

// GET /api/getEntries
export const getEntryById = (req: Request, res: Response, next: NextFunction) => {
  const { entry_id } = req.params;
  console.log(entry_id, "entry_id in controller")
  console.log("Hi from controllerr")

selectEntryById(entry_id)
  .then((entries) => {
    const tarot_card_id= JSON.parse( entries[0].tarot_card_id)
    res.status(200).send({entries: [{ ... entries[0],  tarot_card_id}]});
  })
  .catch((err: any) => {
    next(err);
  });
};

// POST /api/postEntries - entries.ts
export const postEntry = (req: Request, res: Response, next: NextFunction) => {
  console.log(req, "req")
  console.log(req.body, "req.body")
  console.log("in controller")
  
    const entryBody = req.body
    insertEntry(entryBody)
      .then((entry) => {
        console.log(entry, "entry")
        console.log({entry}, "{entry}")
        res.status(201).send({ entry });
      })
      .catch((err: any) => {
        next(err);
      });
  };

  //
