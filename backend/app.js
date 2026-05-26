import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./api/routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app = express();

//  config:
dotenv.config();

//  middlewares:
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.json());

app.use(cookieParser());

//  routes:
app.use("/api/auth", authRouter);

export default app;
