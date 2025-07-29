import express, { Application, Request, Response } from "express"

export const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/vi")
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express with TypeScript!');
});