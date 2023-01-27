import { NextFunction, Request, Response } from "express";
import {
  createUser,
  createPendingUser,
  selectPendingUser,
  deletePendingUser,
} from "../models/auth";
import sendEmail from "../utils/email";
import { generateToken } from '../utils/jwt';


function setTimeBar(limit:number): number {
    return new Date().getTime() + (limit * 30 * 1000);
}

function isExpired(barTimeInSecond:number):boolean {
    const currentTime = new Date();
    const barTime = new Date(barTimeInSecond);
    return (currentTime > barTime) ? false : true;
}




export const signUp = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email} = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);

    // Prepare Email
    const subject = "Sign Up Code for Tarot App!"
    const body = `Please confirm the email address by entering this code : ${code} `;

    sendEmail(email,subject,body)
    .then(()=>{
        return createPendingUser(username, password, email, code);
    })
    .then((pendingUserId) => {
        res.status(200).send({pendingUserId});
    })
    .catch((err) => next(err));
}

export const signUpConfirom = (req: Request, res: Response, next: NextFunction) => {
    const { code, pendingUserId } = req.body;
    selectPendingUser(pendingUserId).then((pendingUser:any) => {
        // check if expired
        const pendingUserCreateDate = pendingUser.created_at; // Step 1 - get the creation date
        const timeLimit = pendingUserCreateDate.getTime() + 15 * 60 * 1000; // Step 2 - change the date format to time format, and add 15 min
        const barDate = new Date(timeLimit); // Step 3 - change it back to date format for comparsion of the current time
        const currentDate = new Date();

        // Step 4 - compare.
        if (currentDate > barDate) {
        deletePendingUser(pendingUserId).then(() => {
            res.status(400).send({ msg: "expired" });
            return;
        });
        }

        // check if code matched.
        if (code !== pendingUser.code) {
        // if token doesnt match
        deletePendingUser(pendingUserId).then(() => {
            res.status(400).send({ msg: "invald code" });
            return;
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
                const token = generateToken(user.email, user.user_id.toString());
                res.status(200).send({token});
            });
        }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  console.log(" in log in controller");
    return;
};