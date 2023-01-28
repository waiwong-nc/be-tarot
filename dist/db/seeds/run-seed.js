"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = __importDefault(require("./seed"));
const data_1 = __importDefault(require("../data"));
const connection_1 = __importDefault(require("../connection"));
const runSeed = () => {
    return (0, seed_1.default)(data_1.default).then(() => connection_1.default.end());
};
runSeed();
