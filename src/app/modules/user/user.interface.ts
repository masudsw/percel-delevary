export enum UserType {
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export interface IUser {
    _id:string;
    name: string;
    email: string;
    userType:UserType
    password: string;
    phone: string;
    address: string;
}