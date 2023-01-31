import { NextFunction, Request, Response } from "express";
import {
  createUser,
  createPendingUser,
  selectPendingUser,
  deletePendingUser,
} from "../models/auth";
import sendEmail from "../utils/email";
import { generateToken } from '../utils/jwt';
import { selectUserByEmail } from "../models/users";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";


class CustomerError extends Error {
  code: number;
  constructor(message = "", code: number) {
    super(message);
    this.code = code;
  }
}


// POST /api/auth/signup
export const signUp = (req: Request, res: Response, next: NextFunction) => {
   
    const result = validationResult(req)
    if (!result.isEmpty()){
        const message = result.array()[0].msg;
        const err = new CustomerError(message,422);
        next(err);
    }

    const { username, password, email} = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);

    // Prepare Email
    const subject = "Sign Up Code for Tarot App!"
    const body = `Please confirm the email address by entering this code : ${code} `;

    sendEmail(email,subject,body)
    .then(async ()=>{
        const hashedPwd = await bcrypt.hash(password,12);
        return createPendingUser(username, hashedPwd, email.toLowerCase(), code);
    })
    .then((pendingUserId:number) => {
        res.status(200).send({pendingUserId});
    })
    .catch((err:any) => next(err));
}


// POST /api/auth/signUpConfirom
export const signUpConfirom = (req: Request, res: Response, next: NextFunction) => {
    
    const { code, pendingUserId } = req.body;
    
    selectPendingUser(pendingUserId)
    .then((pendingUser:any) => {

        // check if expired
        const pendingUserCreateDate = pendingUser.created_at; // Step 1 - get the creation date
        const timeLimit = pendingUserCreateDate.getTime() + 15 * 60 * 1000; // Step 2 - change the date format to time format, and add 15 min
        const barDate = new Date(timeLimit); // Step 3 - change it back to date format for comparsion of the current time
        const currentDate = new Date();
        let error: CustomerError;

        // Step 4 - compare.
        if (currentDate > barDate) {
            return deletePendingUser(pendingUserId).then(() => {
                error= new CustomerError('Code Expired',401);
                return Promise.reject(error);
            });
        }

        // check if code matched.
        if (code !== pendingUser.code) {
            // if token doesnt match
            return deletePendingUser(pendingUserId).then(() => {
              error = new CustomerError("Code Invalid", 401);
              return Promise.reject(error);
            });
        }

        // if code matched.
        if (code === pendingUser.code) {
            createUser(
              pendingUser.user_name.toLowerCase(),
              pendingUser.email.toLowerCase(),
              pendingUser.password
            ).then((user) => {
              const jwt = generateToken(user.email, user.user_id.toString());
              const return_user = {
                jwt: jwt,
                user_id: user.user_id,
                email: user.email,
                user_name: user.user_name,
              };

              res.status(200).send({ user: return_user });
            });
        } else {
            // other unknow error
            error = new CustomerError("Error in Confirmation", 401);
            return Promise.reject(error);
        }
    })
    .catch((err) => {
        next(err);
    })
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
 
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const message = result.array()[0].msg;
        const err = new CustomerError(message, 422);
        next(err);
    }

    let error: CustomerError;
    const { email, password } = req.body;

    selectUserByEmail(email).then((users) => {
        // check if has such email in db
        if (users.length === 0) {
            error = new CustomerError("Email Not Found", 401);
            return Promise.reject(error);
        }
        return users[0];
    })
    .then((user:any) => {
        // check if password match
        return bcrypt.compare(password, user.password)
        .then((isPasswordValid)=> {
            if (isPasswordValid) {
                const jwt = generateToken(user.email, user.user_id.toString());
                return {
                    jwt: jwt,
                    user_id: user.user_id,
                    email: user.email,
                    user_name : user.user_name,
                };
                
            } else {
                error = new CustomerError("Incorrect Password", 401);
                return Promise.reject(error);
            }
        })
    })
    .then((user) => {
        res.status(200).send({ user });
    })
    .catch((err) => {
        next(err);
    })
};