import AppError from "../errorHelpers/AppError";
import { IParcel, STATUS } from "../modules/percel/parcel.interface";
import httpStatus from "http-status-codes"
import { IUser } from "../modules/user/user.interface";
import { STATUS_FLOW } from "./statusFlow";

type Status = `${STATUS}`;
// parcelUtils.ts
export const validateStatusTransition = (
  parcel: IParcel,
  newStatus: Status,
  user: IUser
) => {
  const lastStatus = parcel.statusLogs.slice(-1)[0]?.status as Status || undefined;
  console.log("parcel",parcel)

  // Block ALL duplicate statuses (even for admins)
  if (lastStatus === newStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Parcel is already in ${newStatus} status`
    );
  }

  // Allow admin cancellation from any state
  if (newStatus === 'CANCELLED' && user.userType === 'ADMIN') {
    return; // Skip further validation
  }

  // Apply standard flow rules for all other cases
  if (!lastStatus || !STATUS_FLOW[lastStatus].includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from ${lastStatus} to ${newStatus}`
    );
  }
};