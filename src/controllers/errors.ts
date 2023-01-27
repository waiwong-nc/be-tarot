import { NextFunction, Request, Response } from "express";
import { tableNotFound } from "../models/error";

export const status404 = (req: any, res: Response, next: NextFunction) => {
  res.status(404).send({ msg: "Not Found" });
};

export const customerError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

export const status500 = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  Handle Error from psql
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code) {
    res.status(err.code).send({ msg: err.message });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

// Following are the path that trigger error for testing purpose
class CustomerError extends Error {
  code: number;
  constructor(message = "", code: number) {
    super(message);
    this.code = code;
  }
}

export const triggerServerError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  tableNotFound()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err: any) => {
      next(err);
    });
};

export const triggerStatus500Error = () => {
  throw new CustomerError("Internal Server Error", 500);
};
