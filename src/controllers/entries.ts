import { NextFunction, Request, Response } from "express";
import entries from "../db/data/entries";
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
  console.log(req.body, "req.body")
  console.log("in controller")
  
    const entryBody = req.body
    insertEntry(entryBody)
      .then((entries) => {
        console.log(entries, "entries in controller")
        console.log({entries}, "{entries in controller}")
        const tarot_card_id= JSON.parse( entries.tarot_card_id)

        res.status(201).send({entries: [{ ... entries,  tarot_card_id}]});
      })
      .catch((err: any) => {
        next(err);
      });
  };

  //
