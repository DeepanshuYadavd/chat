import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

//  import routes
import authRouter from "./api/routes/auth.routes.js";
import chatRouter from "./api/routes/chat.routes.js";
import messageRouter from "./api/routes/message.routes.js";

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
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

export default app;
