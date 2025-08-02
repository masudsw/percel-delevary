"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valiateRequest = void 0;
const valiateRequest = (ZodSchema) => async (req, res, next) => {
    try {
        req.body = await ZodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.valiateRequest = valiateRequest;
