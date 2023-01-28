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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLoginError = exports.auth = exports.checkIfUserExist = void 0;
const jwt_1 = require("../utils/jwt");
const users_1 = require("../models/users");
class CustomerError extends Error {
    constructor(message = "", code) {
        super(message);
        this.code = code;
    }
    ;
}
;
;
const checkIfUserExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, users_1.selectUserByEmail)(email);
    return users.length > 0 ? true : false;
});
exports.checkIfUserExist = checkIfUserExist;
const auth = (req, res, next) => {
    let error;
    // Step 1 - Check if token attached in the header
    if (!req.header("authorization")) {
        error = new CustomerError("No Token", 401);
        next(error);
    }
    ;
    // Step 2 - If yes, get the token
    const authHeader = req.header("authorization");
    const token = authHeader.split(" ")[1];
    // Step 3 - Check if the token valid
    const decodeTokenObj = (0, jwt_1.decodedToken)(token);
    if (!decodeTokenObj) {
        error = new CustomerError("Invalid Token", 401);
        next(error);
    }
    req.userId = decodeTokenObj.userId;
    next();
};
exports.auth = auth;
const requireLoginError = () => {
    return new CustomerError('Unauthorised', 401);
};
exports.requireLoginError = requireLoginError;
