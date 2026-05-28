import express from "express";
import { getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/get/:chatId", getMessages);

export default router;
