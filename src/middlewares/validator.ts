import { body } from "express-validator";
import { checkIfUserExist } from "./is-auth";

export const signupInputValidator = () => {

    const emailInput = body("email")
    // .normalizeEmail()
    .escape()
    .isEmail()
    .withMessage("Email Invalid")
    .custom((value,{}) => {
        return checkIfUserExist(value).then((exist) => {
            if (exist) {
                return Promise.reject("Email Already in Use")
            }
        });
    })

    const passwordInput = body("password")
    .trim()
    .notEmpty()
    .withMessage("Password Empty")
    .isLength({ min: 6, max: 30 });

    const usesrnameInput = body("username")
      .trim()
      .notEmpty()
      .withMessage("Username Empty")
      .isLength({ min: 1, max: 30 })
   
    
    return [emailInput, passwordInput, usesrnameInput];
}


export const loginInInputValidator = () => {

    const emailInput = body("email")
    //   .normalizeEmail()
      .escape()
      .isEmail()
      .withMessage("Email Invalid")
      .custom((value, {}) => {
        return checkIfUserExist(value).then((exist) => {
          if (!exist) {
            return Promise.reject("Email Not Found");
          }
        });
      });

    const passwordInput = body("password")
      .trim()
      .notEmpty()
      .withMessage("Password Empty")
      .isLength({ min: 6, max: 30 });


      return [emailInput, passwordInput];
};


export const entryInputValidator = () => {


  
  const intention = body("intention")
    .trim()
    .notEmpty()
    .withMessage("'intention' Empty")
    .isLength({ min: 1, max: 1000 });
  
  const entryBody = body("entry_body")
    .trim()
    .notEmpty()
    .withMessage("'Entry Body' Empty")
    .isLength({ min: 1, max: 1000 });


  return [intention, entryBody];
};

