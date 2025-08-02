"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const user_validation_1 = require("./user.validation");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("./user.interface");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.valiateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createUser);
router.patch('/:email/block', (0, checkAuth_1.checkAuth)(user_interface_1.UserType.ADMIN), user_controller_1.UserController.userBlockUpdate);
exports.UserRouter = router;
