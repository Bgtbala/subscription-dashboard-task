import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// -----------------------------
// Admin Login
// -----------------------------
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  const { accessToken, refreshToken } = admin.generateTokens();

  admin.refreshToken = refreshToken;
  await admin.save();

  return res.status(200).json(
    ApiResponse.success(
      {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        accessToken,
        refreshToken,
      },
      "Admin login successful"
    )
  );
});

// -----------------------------
// Refresh Admin Token
// -----------------------------
export const refreshAdminToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new ApiError(400, "Refresh token is required");

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const admin = await Admin.findById(decoded._id);

  if (!admin || admin.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const newAccessToken = admin.generateAccessToken();
  const newRefreshToken = admin.generateRefreshToken();

  admin.refreshToken = newRefreshToken;
  await admin.save();

  return res.status(200).json(
    ApiResponse.success(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Admin tokens refreshed"
    )
  );
});

// -----------------------------
// Logout Admin
// -----------------------------
export const adminLogout = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;

  if (!adminId) throw new ApiError(401, "Admin not authenticated");

  const admin = await Admin.findById(adminId);
  if (admin) {
    admin.refreshToken = null;
    await admin.save();
  }

  return res.status(200).json(ApiResponse.success(null, "Admin logged out"));
});
