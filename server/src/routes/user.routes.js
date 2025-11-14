import express from "express";
import * as authController from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { registerSchema, loginSchema, refreshSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.registerUser);
router.post("/login", validate(loginSchema), authController.loginUser);
router.post("/refresh", validate(refreshSchema), authController.refreshAccessToken);
router.post("/logout", verifyJWT(["user", "admin"]), authController.logoutUser);

export default router;
