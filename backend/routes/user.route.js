import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";


const router = express.Router();
console.log("✅ user.route.js reached");

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").post(authenticate, updateProfile);

export default router;


