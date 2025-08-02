"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const percel_route_1 = require("../modules/percel/percel.route");
exports.router = (0, express_1.Router)();
exports.router.use("/user", user_route_1.UserRouter);
exports.router.use("/auth", auth_route_1.AuthRouter);
exports.router.use("/parcel", percel_route_1.ParcelRouter);
// router.use("/percel",PercelRouter)
