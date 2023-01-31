"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodedToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (email, userId) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({
        email: email,
        userId: userId
    }, secret, { expiresIn: "180d" });
};
exports.generateToken = generateToken;
const decodedToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (err) {
        return false;
    }
};
exports.decodedToken = decodedToken;
