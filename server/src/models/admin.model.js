import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: "admin",
    },
    refreshToken: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

// 🔐 Hash password before save
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare Password
adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// 🔑 Generate Access Token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: "admin" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

// 🔁 Generate Refresh Token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: "admin" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// 🧩 Generate both tokens
adminSchema.methods.generateTokens = function () {
  return {
    accessToken: this.generateAccessToken(),
    refreshToken: this.generateRefreshToken(),
  };
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
