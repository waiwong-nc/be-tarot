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


export const signUp = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email} = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);

    // Prepare Email
    const subject = "Sign Up Code for Tarot App!"
    const body = `Please confirm the email address by entering this code : ${code} `;

    sendEmail(email,subject,body)
    .then(async ()=>{
        const hashedPwd = await bcrypt.hash(password,12);
        return createPendingUser(username, hashedPwd, email, code);
    })
    .then((pendingUserId:number) => {
        res.status(200).send({pendingUserId});
    })
    .catch((err:any) => next(err));
}

class CustomerError extends Error {
  code: number;
  constructor(message = "", code: number) {
    super(message);
    this.code = code;
  }
}


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
                pendingUser.user_name,
                pendingUser.email,
                pendingUser.password
            )
            .then((user) => {

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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  console.log(" in log in controller");
  let error: CustomerError;
  const { email, password } = req.body;
  selectUserByEmail(email).then((users) => {
    // check if has such email in db
    if (users.length === 0) {
      error = new CustomerError("Email Not Found", 401);
      return Promise.reject(error);
    };

    const user = users[0];

    // check if password match
    bcrypt.compare(password, user.password)
    .then(()=> {
        const jwt = generateToken(user.email, user.user_id.toString());
        const return_user = {
          jwt: jwt,
          user_id: user.user_id,
          email: user.email,
          user_name : user.user_name,
        };
        
        res.status(200).send({ user: return_user });
    })
    .catch(()=> {
        error = new CustomerError("Incorrect Password", 401);
        return Promise.reject(error);
    });

  })
  .catch((err) => {
      console.log(err)
      next(err);
  })
//    
//     return;
};