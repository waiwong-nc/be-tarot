"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entryInputValidator = exports.loginInInputValidator = exports.signupInputValidator = void 0;
const express_validator_1 = require("express-validator");
const is_auth_1 = require("./is-auth");
const signupInputValidator = () => {
    const emailInput = (0, express_validator_1.body)("email")
        // .normalizeEmail()
        .escape()
        .isEmail()
        .withMessage("Email Invalid")
        .custom((value, {}) => {
        return (0, is_auth_1.checkIfUserExist)(value).then((exist) => {
            if (exist) {
                return Promise.reject("Email Already in Use");
            }
        });
    });
    const passwordInput = (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password Empty")
        .isLength({ min: 6, max: 30 });
    const usesrnameInput = (0, express_validator_1.body)("username")
        .trim()
        .notEmpty()
        .withMessage("Username Empty")
        .isLength({ min: 1, max: 30 });
    return [emailInput, passwordInput, usesrnameInput];
};
exports.signupInputValidator = signupInputValidator;
const loginInInputValidator = () => {
    const emailInput = (0, express_validator_1.body)("email")
        //   .normalizeEmail()
        .escape()
        .isEmail()
        .withMessage("Email Invalid")
        .custom((value, {}) => {
        return (0, is_auth_1.checkIfUserExist)(value).then((exist) => {
            if (!exist) {
                return Promise.reject("Email Not Found");
            }
        });
    });
    const passwordInput = (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password Empty")
        .isLength({ min: 6, max: 30 });
    return [emailInput, passwordInput];
};
exports.loginInInputValidator = loginInInputValidator;
const entryInputValidator = () => {
    const intention = (0, express_validator_1.body)("intention")
        .trim()
        .notEmpty()
        .withMessage("'intention' Empty")
        .isLength({ min: 1, max: 1000 });
    const entryBody = (0, express_validator_1.body)("entry_body")
        .trim()
        .notEmpty()
        .withMessage("'Entry Body' Empty")
        .isLength({ min: 1, max: 1000 });
    return [intention, entryBody];
};
exports.entryInputValidator = entryInputValidator;
