"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerStatus500Error = exports.triggerServerError = exports.status500 = exports.customerError = exports.status404 = void 0;
const error_1 = require("../models/error");
const status404 = (req, res, next) => {
    res.status(404).send({ msg: "Not Found" });
};
exports.status404 = status404;
const customerError = (err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    else {
        next(err);
    }
};
exports.customerError = customerError;
const status500 = (err, req, res, next) => {
    //  Handle Error from psql
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    }
    else if (err.code) {
        res.status(err.code).send({ msg: err.message });
    }
    else {
        res.status(500).send({ msg: "Internal Server Error" });
    }
};
exports.status500 = status500;
// Following are the path that trigger error for testing purpose
class CustomerError extends Error {
    constructor(message = "", code) {
        super(message);
        this.code = code;
    }
}
const triggerServerError = (req, res, next) => {
    (0, error_1.tableNotFound)()
        .then((users) => {
        res.status(200).send({ users: users });
    })
        .catch((err) => {
        next(err);
    });
};
exports.triggerServerError = triggerServerError;
const triggerStatus500Error = () => {
    throw new CustomerError("Internal Server Error", 500);
};
exports.triggerStatus500Error = triggerStatus500Error;
