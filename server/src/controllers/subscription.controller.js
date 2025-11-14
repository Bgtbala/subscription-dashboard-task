import Subscription from "../models/subscription.model.js";
import Plan from "../models/plan.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/users.model.js";

// ✅ Subscribe user to a plan
export const subscribeToPlan = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { planId } = req.params;

  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(404, "Plan not found");

  const existingSub = await Subscription.findOne({
    user: userId,
    status: "active",
  });

  if (existingSub) {
    throw new ApiError(400, "You already have an active subscription");
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.duration);

  const subscription = await Subscription.create({
    user: userId,
    plan: plan._id,
    start_date: startDate,
    end_date: endDate,
    status: "active",
  });

  return res
    .status(201)
    .json(ApiResponse.success(subscription, "Subscription successful"));
});

// ✅ Get user's active subscription
export const getMySubscription = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const subscription = await Subscription.findOne({
    user: userId,
    status: "active",
  }).populate("plan", "name price features duration");

  if (!subscription) {
    throw new ApiError(404, "No active subscription found");
  }

  return res
    .status(200)
    .json(ApiResponse.success(subscription, "Active subscription fetched"));
});

// ✅ Get all subscriptions (Admin) with optional email filter
export const getAllSubscriptions = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const query = {};

  // ----------------------------------------------------
  // 🔍 Combined user filter (name OR email)
  // ----------------------------------------------------
  if (search) {
    const matchingUsers = await User.find(
      {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      },
      "_id"
    );

    query.user = { $in: matchingUsers };
  }

  // ----------------------------------------------------
  // Fetch subscriptions with populated user + plan
  // ----------------------------------------------------
  const subscriptions = await Subscription.find(query)
    .populate("user", "name email")
    .populate("plan", "name price duration");

  return res
    .status(200)
    .json(ApiResponse.success(subscriptions, "Subscriptions fetched"));
});


// Create / Change / Upgrade / Downgrade Subscription
export const changePlan = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🚀 ~ changePlan ~ userId:", userId)
    const { newPlanId } = req.params;
    console.log("🚀 ~ changePlan ~ newPlanId:", newPlanId)

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan) {
      console.error("Plan not found:", newPlanId);
      throw new ApiError(404, "New plan not found");
    }

    let currentSub = await Subscription.findOne({
      user: userId,
      status: "active",
    });

    if (currentSub) {
      currentSub.status = "cancelled";
      await currentSub.save();
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + newPlan.duration);

    const subscription = await Subscription.create({
      user: userId,
      plan: newPlan._id,
      start_date: startDate,
      end_date: endDate,
      status: "active",
    });

    return res
      .status(200)
      .json(ApiResponse.success(subscription, "Subscription updated successfully"));
  } catch (error) {
    console.error("Error in changePlan:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message || "Something went wrong"));
  }
};

