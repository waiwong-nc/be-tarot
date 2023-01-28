"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenError extends Error {
    constructor(message = "", code) {
        super(message);
        this.code = code;
    }
}
const auth = (req, res, next) => {
    // Step 1 - Check if JWT is attached in request
    if (!req.header('authorization'))
        throw new TokenError("Token Not Found", 401);
    // If yes, get the token
    const authHeader = req.header('authorization');
    const token = authHeader.split()[1];
};
