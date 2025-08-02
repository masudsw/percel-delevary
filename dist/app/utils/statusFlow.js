"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_FLOW = void 0;
const parcel_interface_1 = require("../modules/percel/parcel.interface");
exports.STATUS_FLOW = {
    [parcel_interface_1.STATUS.REQUESTED]: [parcel_interface_1.STATUS.PICKED, parcel_interface_1.STATUS.CANCELLED],
    [parcel_interface_1.STATUS.PICKED]: [parcel_interface_1.STATUS.IN_TRANSIT, parcel_interface_1.STATUS.CANCELLED],
    [parcel_interface_1.STATUS.IN_TRANSIT]: [parcel_interface_1.STATUS.DELIVERED],
    [parcel_interface_1.STATUS.DELIVERED]: [], // Final state
    [parcel_interface_1.STATUS.CANCELLED]: [] // Final state
};
