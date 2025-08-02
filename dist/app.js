"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use("/api/v1", routes_1.router);
exports.app.get('/', (req, res) => {
    res.send('welcome to percel delevery backend...!');
});
exports.app.use(globalErrorHandler_1.globalErrorHandler);
exports.app.use(notFound_1.default);
