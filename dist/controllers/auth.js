"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUpConfirom = exports.signUp = void 0;
const auth_1 = require("../models/auth");
const email_1 = __importDefault(require("../utils/email"));
const jwt_1 = require("../utils/jwt");
const users_1 = require("../models/users");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
class CustomerError extends Error {
    constructor(message = "", code) {
        super(message);
        this.code = code;
    }
}
// POST /api/auth/signup
const signUp = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const message = result.array()[0].msg;
        const err = new CustomerError(message, 422);
        next(err);
    }
    const { username, password, email } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);
    // Prepare Email
    const subject = "Sign Up Code for Tarot App!";
    const body = `Please confirm the email address by entering this code : ${code} `;
    (0, email_1.default)(email, subject, body)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPwd = yield bcryptjs_1.default.hash(password, 12);
        return (0, auth_1.createPendingUser)(username, hashedPwd, email, code);
    }))
        .then((pendingUserId) => {
        res.status(200).send({ pendingUserId });
    })
        .catch((err) => next(err));
};
exports.signUp = signUp;
// POST /api/auth/signUpConfirom
const signUpConfirom = (req, res, next) => {
    const { code, pendingUserId } = req.body;
    (0, auth_1.selectPendingUser)(pendingUserId)
        .then((pendingUser) => {
        // check if expired
        const pendingUserCreateDate = pendingUser.created_at; // Step 1 - get the creation date
        const timeLimit = pendingUserCreateDate.getTime() + 15 * 60 * 1000; // Step 2 - change the date format to time format, and add 15 min
        const barDate = new Date(timeLimit); // Step 3 - change it back to date format for comparsion of the current time
        const currentDate = new Date();
        let error;
        // Step 4 - compare.
        if (currentDate > barDate) {
            return (0, auth_1.deletePendingUser)(pendingUserId).then(() => {
                error = new CustomerError('Code Expired', 401);
                return Promise.reject(error);
            });
        }
        // check if code matched.
        if (code !== pendingUser.code) {
            // if token doesnt match
            return (0, auth_1.deletePendingUser)(pendingUserId).then(() => {
                error = new CustomerError("Code Invalid", 401);
                return Promise.reject(error);
            });
        }
        // if code matched.
        if (code === pendingUser.code) {
            (0, auth_1.createUser)(pendingUser.user_name, pendingUser.email, pendingUser.password)
                .then((user) => {
                const jwt = (0, jwt_1.generateToken)(user.email, user.user_id.toString());
                const return_user = {
                    jwt: jwt,
                    user_id: user.user_id,
                    email: user.email,
                    user_name: user.user_name,
                };
                res.status(200).send({ user: return_user });
            });
        }
        else {
            // other unknow error
            error = new CustomerError("Error in Confirmation", 401);
            return Promise.reject(error);
        }
    })
        .catch((err) => {
        next(err);
    });
};
exports.signUpConfirom = signUpConfirom;
// POST /api/auth/login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const message = result.array()[0].msg;
        const err = new CustomerError(message, 422);
        next(err);
    }
    let error;
    const { email, password } = req.body;
    (0, users_1.selectUserByEmail)(email).then((users) => {
        // check if has such email in db
        if (users.length === 0) {
            error = new CustomerError("Email Not Found", 401);
            return Promise.reject(error);
        }
        ;
        const user = users[0];
        // check if password match
        bcryptjs_1.default.compare(password, user.password)
            .then(() => {
            const jwt = (0, jwt_1.generateToken)(user.email, user.user_id.toString());
            const return_user = {
                jwt: jwt,
                user_id: user.user_id,
                email: user.email,
                user_name: user.user_name,
            };
            res.status(200).send({ user: return_user });
        })
            .catch(() => {
            error = new CustomerError("Incorrect Password", 401);
            return Promise.reject(error);
        });
    })
        .catch((err) => {
        next(err);
    });
});
exports.login = login;
