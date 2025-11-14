import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/admin.model.js";
import User from "../models/users.model.js";

export const verifyJWT = (allowedRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const token =
      req.headers["authorization"]?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!token) throw new ApiError(401, "Unauthorized request: No token provided");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const userId = decoded._id || decoded.id;
    console.log("🚀 ~ verifyJWT ~ userId:", userId)

    const role = decoded.role;
    console.log("🚀 ~ verifyJWT ~ role:", role)

    if (!role) throw new ApiError(401, "Invalid token: Missing role");

    let user = null;

    if (role === "admin") {
      user = await Admin.findById(userId).select("-password -refreshToken");
    } else if (role === "user") {
      user = await User.findById(userId).select("-password -refreshToken");
      console.log("🚀 ~ verifyJWT ~ user:", user)
    }

    if (!user) throw new ApiError(401, "User not found");

    // Role-based restriction
    if (allowedRoles.length && !allowedRoles.includes(role)) {
      throw new ApiError(403, "Forbidden: Not allowed");
    }

    req.user = user;
    next();
  });
};
