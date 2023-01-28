"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (recipientEmail, subject, body) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPW,
        },
    });
    return transporter.sendMail({
        from: '"Over React Team" <overreacttest@gmail.com>',
        to: recipientEmail,
        subject: subject,
        html: body, // html body
    });
};
exports.default = sendEmail;
