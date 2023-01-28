"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./router/users"));
const entries_1 = __importDefault(require("./router/entries"));
const auth_1 = __importDefault(require("./router/auth"));
const errors_1 = require("./controllers/errors");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const cors = require("cors");
app.use(express_1.default.json());
app.use(cors());
// Routes 
app.get("/", (req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, '/views/index.html'));
});
app.use("/api/users", users_1.default);
app.use("/api/entries", entries_1.default);
app.use("/api/auth", auth_1.default);
// **** Only enable this router during development stage **** //
const errorTest_1 = __importDefault(require("./router/errorTest"));
app.use("/api/error-test", errorTest_1.default);
// **** Only enable this router during development stage **** //
// Error Handling
app.all("*", errors_1.status404);
app.use(errors_1.customerError);
app.use(errors_1.status500);
exports.default = app;
