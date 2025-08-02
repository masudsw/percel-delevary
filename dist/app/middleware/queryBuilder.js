"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryBuilder = void 0;
const queryBuilder = (model, searchableFields) => {
    return async (req, res, next) => {
        try {
            const queryParams = { ...req.query };
            const mongoQuery = {};
            //search
            const searchTerm = queryParams.searchTerm;
            if (searchTerm) {
                mongoQuery.$or = searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' }
                }));
            }
            const excludeFields = [
                'searchTerm',
                'sort',
                'limit',
                'page',
                'fields',
                'minCost',
                'maxCost'
            ];
            /* eslint-disable @typescript-eslint/no-dynamic-delete */
            excludeFields.forEach((field) => delete queryParams[field]);
            for (const key in queryParams) {
                const value = queryParams[key];
                if (typeof value === 'string') {
                    mongoQuery[key] = { $regex: value, $options: 'i' };
                }
            }
            //cost range
            const minCost = Number(req.query.minCost);
            const maxCost = Number(req.query.maxCost);
            if (!isNaN(minCost) && !isNaN(maxCost)) {
                mongoQuery['shippingFee'] = { $gte: minCost, $lte: maxCost };
            }
            //Base mongoose query
            let query = model.find(mongoQuery);
            //sort
            const sortBy = req.query.sort?.split(',')?.join(' ') || '-createdAt';
            query = query.sort(sortBy);
            //fields
            const fields = req.query.fields?.split(',')?.join(' ') || '-__v';
            query = query.select(fields);
            //pagination
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
            //total count for pagination
            const total = await model.countDocuments(mongoQuery);
            const totalPage = Math.ceil(total / limit);
            //attach results and meta to res.locals
            const results = await query;
            res.locals.data = {
                meta: {
                    page,
                    limit,
                    total,
                    totalPage,
                },
                results,
            };
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.queryBuilder = queryBuilder;
