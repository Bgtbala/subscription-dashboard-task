import express from "express";
import * as subscriptionController from "../controllers/subscription.controller.js";
import * as planController from "../controllers/plan.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { subscribeSchema } from "../validations/subscription.validation.js";

const router = express.Router();

// Public routes
router.get("/plans", planController.getAllPlans);

// User routes
router.post(
  "/subscribe/:planId",
  verifyJWT(["user"]),
  validate(subscribeSchema, "params"),
  subscriptionController.subscribeToPlan
);

router.get(
  "/my-subscription",
  verifyJWT(["user"]),
  subscriptionController.getMySubscription
);

// Admin routes
router.get(
  "/admin/subscriptions",
  verifyJWT(["admin"]),
  subscriptionController.getAllSubscriptions
);

router.post(
  "/change-plan/:newPlanId",
  verifyJWT(["user"]),
  subscriptionController.changePlan
);

export default router;
