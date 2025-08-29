import express, { Application, Request, Response } from "express"
import cookieParser from "cookie-parser"
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cors from "cors"
import passport from "passport";
import expressSession from "express-session"
import { envVars } from "./app/config/env";
import "./app/config/passport"


export const app: Application = express();


app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin:envVars.FRONTEND_URL,
  credentials:true
}))


app.use(express.urlencoded({ extended: true }));
app.use("/api/v1",router)
app.get('/', (req: Request, res: Response) => {
    res.send('welcome to percel delevery backend...!');
});
app.use(globalErrorHandler)
app.use(notFound)