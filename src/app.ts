import express, { Application, Request, Response } from "express"
import cookieParser from "cookie-parser"
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

export const app: Application = express();
app.use((req, res, next) => {
//   console.log(`Incoming ${req.method} ${req.path}`);
//   console.log('Headers:', req.headers);
//   console.log('Raw body:', req.body); // Should be undefined at this stage
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1",router)
app.get('/', (req: Request, res: Response) => {
    res.send('welcome to percel delevery backend...!');
});
app.use(globalErrorHandler)
app.use(notFound)