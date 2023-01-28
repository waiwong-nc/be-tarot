"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postEntry = exports.getEntryById = exports.getEntries = void 0;
const entries_1 = require("../models/entries");
const is_auth_1 = require("../middlewares/is-auth");
const express_validator_1 = require("express-validator");
class CustomerError extends Error {
    constructor(message = "", code) {
        super(message);
        this.code = code;
    }
}
// GET /api/getEntries
const getEntries = (req, res, next) => {
    let userId;
    if (!req.userId) {
        next(is_auth_1.requireLoginError);
    }
    else {
        userId = req.userId;
    }
    (0, entries_1.selectAllEntriesById)(userId)
        .then((entries) => {
        res.status(200).send({ entries });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getEntries = getEntries;
// GET /api/getEntries
const getEntryById = (req, res, next) => {
    let userId;
    if (!req.userId) {
        next(is_auth_1.requireLoginError);
    }
    else {
        userId = req.userId;
    }
    const { entry_id } = req.params;
    (0, entries_1.selectEntryById)(entry_id, userId)
        .then((entries) => {
        console.log(entries, "<< entries");
        const tarot_card_id = JSON.parse(entries[0].tarot_card_id);
        res.status(200).send({ entries: [Object.assign(Object.assign({}, entries[0]), { tarot_card_id })] });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getEntryById = getEntryById;
// POST /api/postEntries - entries.ts
const postEntry = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const message = result.array()[0].msg;
        const err = new CustomerError(message, 422);
        next(err);
    }
    let userId;
    if (!req.userId) {
        next(is_auth_1.requireLoginError);
    }
    else {
        userId = req.userId;
    }
    const entryBody = req.body;
    (0, entries_1.insertEntry)(userId, entryBody)
        .then((entries) => {
        const tarot_card_id = JSON.parse(entries.tarot_card_id);
        res.status(201).send({ entries: [Object.assign(Object.assign({}, entries), { tarot_card_id })] });
    })
        .catch((err) => {
        next(err);
    });
};
exports.postEntry = postEntry;
//
