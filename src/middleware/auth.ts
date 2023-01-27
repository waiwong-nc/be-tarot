import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

class TokenError extends Error {
  code: number;
  constructor(message = "", code: number) {
    super(message);
    this.code = code;
  }
}


const auth:RequestHandler = (req, res, next) => {

    // Step 1 - Check if JWT is attached in request
    if (!req.header('authorization') ) throw new TokenError("Token Not Found", 401);
    
    // If yes, get the token
    const authHeader:any = req.header('authorization')
    const token = authHeader.split()[1];

}