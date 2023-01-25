import { NextFunction, Request, Response } from "express";
import { selectAllUsers } from "../models/users";



// GET /api/user
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    selectAllUsers()
      .then((users) => {
        res.status(200).send({ users: users });
      })
      .catch((err: any) => {
        next(err);
      });
};
