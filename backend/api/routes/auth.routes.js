import express from "express";
import { signin, signup, logout, getUsers } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

//  get all users:
router.get("/get-users", protect, getUsers);

export default router;
