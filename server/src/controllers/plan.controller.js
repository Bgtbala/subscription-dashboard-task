import Plan from "../models/plan.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Get all available plans
export const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find();
  if (!plans.length) throw new ApiError(404, "No plans found");

  return res
    .status(200)
    .json(ApiResponse.success(plans, "Plans fetched successfully"));
});
