"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.getUsers = void 0;
const users_1 = require("../models/users");
const is_auth_1 = require("../middlewares/is-auth");
// GET /api/user
const getUsers = (req, res, next) => {
    (0, users_1.selectAllUsers)()
        .then((users) => {
        res.status(200).send({ users: users });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getUsers = getUsers;
// GET /api/users/profile
const getProfile = (req, res, next) => {
    let userId;
    if (!req.userId) {
        next(is_auth_1.requireLoginError);
    }
    else {
        userId = req.userId;
    }
    (0, users_1.selectUserById)(userId)
        .then((user) => {
        delete user[0].password;
        res.status(200).send({ user: user[0] });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getProfile = getProfile;
