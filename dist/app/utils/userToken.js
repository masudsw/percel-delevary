"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const jwt_1 = require("./jwt");
const env_1 = require("../config/env");
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        userType: user.userType
    };
    const accssToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return accssToken;
};
exports.createUserToken = createUserToken;
