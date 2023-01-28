import { NextFunction, Request, Response } from "express";
import { selectAllUsers, selectUserById } from "../models/users";
import { requireLoginError } from "../middlewares/is-auth";

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

// GET /api/users/profile
export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  
  let userId;
  if (!req.userId) { 
    next(requireLoginError);
  } else {
    userId = req.userId
  }
  
  selectUserById(userId)
    .then((user: any) => {
      delete user[0].password
      res.status(200).send({ user: user[0] });
    })
    .catch((err: any) => {
      next(err);
    });
};