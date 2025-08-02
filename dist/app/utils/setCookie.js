"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, accessToken) => {
    if (accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false
        });
    }
};
exports.setAuthCookie = setAuthCookie;
