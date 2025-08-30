

export enum UserType {
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export interface IAuthProvider{
    provider:"google"|"credentials";
    providerId:string
}

export interface IUser {
    _id:string;
    name: string;
    email: string;
    userType:UserType;
    password: string;
    auths:IAuthProvider[];
    phone: string;
    address: string;
    isBlocked:boolean;
    isVarified:boolean;
}