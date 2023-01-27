import e, { NextFunction, Request, Response } from "express";
import { decodedToken } from "../utils/jwt";
import { selectUserByEmail, selectAllUsers } from "../models/users";

class CustomerError extends Error {
  code: number;
  constructor(message = "", code: number) {
    super(message);
    this.code = code;
  };
};

declare module "express-serve-static-core" {
    interface Request {
        userId?: any;
    }
};



export const auth =  (req: Request, res: Response, next: NextFunction) => {

    let error: CustomerError;

    // Step 1 - Check if token attached in the header
    if (!req.header("authorization")) {
        error = new CustomerError("No Token", 401);
        next(error);
    };

    // Step 2 - If yes, get the token
    const authHeader: any = req.header("authorization");
    const token = authHeader.split(" ")[1];

    // Step 3 - Check if the token valid
    const decodeTokenObj:any = decodedToken(token);
    if (!decodeTokenObj) {
        error = new CustomerError("Invalid Token", 401);
        next(error);
    };

    req.userId = decodeTokenObj.userId; 
    next();
}

export const checkIfUserExist = async (email:string) => {
    const users = await selectUserByEmail(email);
    return (users)? true: false;
}