import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createChat } from "../controllers/chats.controller.js";

const router = express.Router();

router.post("/create", protect, createChat);

export default router;
