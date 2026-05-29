import express from "express";
import { signin, signup, logout, getUsers } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


//  get all users:
router.get("/get-users", protect, getUsers);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);



export default router;
