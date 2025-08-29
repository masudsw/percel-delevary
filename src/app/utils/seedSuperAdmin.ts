import { envVars } from "../config/env"
import { IAuthProvider, IUser, UserType } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist=await User.findOne({email:envVars.SUPER_ADMIN_EMAIL})
        if(isSuperAdminExist){
            console.log("Super admin exists!!")
            return;
        }
        console.log("Trying to create Super Admin....");
        const hashedPassword= await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD,Number(envVars.BCRYPT_SALT_ROUND));

        const authProvider:IAuthProvider={
            provider:"credentials",
            providerId:envVars.SUPER_ADMIN_EMAIL
        }

        const payload:Partial<IUser>={
            name:"Super Admin",
            userType:UserType.SUPER_ADMIN,
            email:envVars.SUPER_ADMIN_EMAIL,
            address:"Dhaka",
            phone:"0181111111",
            password:hashedPassword,
            isVarified:true,
            auths:[authProvider]
        }
        const superadmin=await User.create(payload)
        console.log("Super admin created successfully!!")
        console.log(superadmin)

    } catch (error) {
        console.log(error)
    }
}