import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import {Strategy as GoogleStrategy,Profile, VerifyCallback} from "passport-google-oauth20"
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"
import { envVars } from "./env"
import { UserType } from "../modules/user/user.interface"

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            photo: profile.photos?.[0]?.value,
            userType: UserType.SENDER,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("Google strategy error",error);
        done(error);
      }
    }
  )
);


passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        console.log('Passport strategy invoked for email:', email);
        try {
            
            const isUserExist = await User.findOne({ email })
            console.log(isUserExist)
            if (!isUserExist) {
                return done("User does not exist")
            }
            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")
            if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { message: "Already authenticated throw google.First login with google. Set a password if you want gmail and passwrod" })

            }
            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password does not match" })
            }
            return done(null, isUserExist)
        } catch (error) {
            console.log(error);
            done(error)
        }


    })
)

passport.serializeUser((user:any, done:(err:any, id?:unknown)=>void)=>{
   done(null, user._id)
})
passport.deserializeUser(async(id:string, done:any)=>{
    try{
        const user=await User.findById(id);
        done(null,user)
    }catch(error){
        console.log(error);
        done(error)
    }
})