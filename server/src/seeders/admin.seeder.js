import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/admin.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("✅ DB Connected");

    const existingAdmin = await Admin.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const adminData = {
      name: "Super Admin",
      email: "admin@example.com",
      password: "Admin@123", // You can override via env
    };

    const admin = await Admin.create(adminData);

    console.log("🌱 Admin user created successfully:");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔐 Password: ${adminData.password}`);
    console.log("⚠️ Please change this password in production!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
