import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.js";
import { adminLoginSchema } from "../validations/admin.validation.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/login",
  validate(adminLoginSchema),
  adminController.adminLogin
);

router.post(
  "/refresh",
  adminController.refreshAdminToken
);

router.post(
  "/logout",
  verifyJWT(["admin"]),
  adminController.adminLogout
);

export default router;
