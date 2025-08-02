import { STATUS } from "../modules/percel/parcel.interface";

type Status = `${STATUS}`;
export const STATUS_FLOW: Record<Status, Status[]> = {
  [STATUS.REQUESTED]: [STATUS.PICKED, STATUS.CANCELLED],
  [STATUS.PICKED]: [STATUS.IN_TRANSIT, STATUS.CANCELLED],
  [STATUS.IN_TRANSIT]: [STATUS.DELIVERED],
  [STATUS.DELIVERED]: [], // Final state
  [STATUS.CANCELLED]: [] // Final state
};