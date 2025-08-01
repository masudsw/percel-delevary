import { model, Schema } from "mongoose";
import { IAddressFormat, IDimentions, IParcel, IStatusLog, STATUS } from "./parcel.interface";
const addressSchema = new Schema<IAddressFormat>({
    address: { type: String, required: true },
    district: { type: String, required: true },
    country: { type: String, required: true }
},{_id:false})
const dimensionSchema = new Schema<IDimentions>({
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    length: { type: Number, required: true }
},{_id:false})
const statusLogSchema = new Schema<IStatusLog>({
    status: { 
        type: String, 
        enum: Object.values(STATUS), 
        required: true 
    },
    timestamp: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    location: { 
        type: String, 
        required: true 
    },
    notes: { 
        type: String, 
        required: true 
    }
}, { _id: false });

const parcelSchema = new Schema<IParcel>({
    trackingId: { type: String, unique: true, required: true },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    originAddress: {
        type: addressSchema,
        required: true
    },
    destinationAddress: {
        type: addressSchema,
        required: true
    },
    dimentions: {
        type: dimensionSchema,
        required: true
    },
    weight:{
        type:Number, required:true
    },
    statusLogs: {
        type: [statusLogSchema], 
        default: [] 
    },
    description: {
        type: String,
        required: true
    },
    shippingFee: {
        type: Number
    },
    estimatedDeliveryDate: {
        type: Date
    },

    currentStatus: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.REQUESTED
    }

},{timestamps:true})
export const Parcel = model<IParcel>("Parcel", parcelSchema)
