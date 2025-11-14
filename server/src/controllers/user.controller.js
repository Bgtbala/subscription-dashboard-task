import User from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// ✅ Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const user = await User.create({ name, email, password });
  const { accessToken, refreshToken } = user.generateTokens();

  user.refreshToken = refreshToken;
  await user.save();

  return res
    .status(201)
    .json(ApiResponse.success(
      { user, accessToken, refreshToken },
      "User registered successfully"
    ));
});

// ✅ Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("🚀 ~ password:", password)
  console.log("🚀 ~ email:", email)
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(400, "Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(400, "Invalid email or password");

  const { accessToken, refreshToken } = user.generateTokens();

  user.refreshToken = refreshToken;
  await user.save();

  return res.status(200).json(
    ApiResponse.success(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      "Login successful"
    )
  );
});

// ✅ Refresh access token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, "Refresh token is required");

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save();

  return res.status(200).json(
    ApiResponse.success(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Tokens refreshed successfully"
    )
  );
});

// ✅ Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "User not authenticated");

  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.status(200).json(ApiResponse.success(null, "Logout successful"));
});
