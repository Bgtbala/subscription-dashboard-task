// src/routes/index.js
import { Router } from "express";

// Import route modules
import authRoutes from "./user.routes.js";
import planRoutes from "./plan.routes.js";
import subscriptionRoutes from "./subscription.route.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

// Health check route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API root is working 🚀",
  });
});

// Mount all routes
router.use("/user", authRoutes);
router.use("/admin", adminRoutes);
router.use("/plans", planRoutes);
router.use("/", subscriptionRoutes); 
// subscription routes already contain: 
// /subscribe/:planId
// /my-subscription
// /admin/subscriptions

export default router;
