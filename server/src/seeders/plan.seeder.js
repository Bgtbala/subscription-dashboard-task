import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Plan from "../models/plan.model.js";

dotenv.config();

/**
 * Seeder Script: Seeds Bronze, Silver, Gold, and Platinum plans
 * into MongoDB for the Subscription Management Dashboard.
 */

const plans = [
  {
    name: "Bronze Plan",
    price: 299,
    duration: 30, // 30 days
    features: [
      "Access to core platform features",
      "Basic analytics dashboard",
      "Community support",
      "Single user access",
    ],
  },
  {
    name: "Silver Plan",
    price: 799,
    duration: 90, // 3 months
    features: [
      "Everything in Bronze",
      "Advanced analytics and reporting",
      "Email support with 24-hour response time",
      "Up to 5 team members",
      "Customizable profile dashboard",
    ],
  },
  {
    name: "Gold Plan",
    price: 1499,
    duration: 180, // 6 months
    features: [
      "Everything in Silver",
      "Priority support (response within 6 hours)",
      "Team management tools",
      "Role-based access control",
      "API access and webhook integrations",
      "Export and backup data options",
    ],
  },
  {
    name: "Platinum Plan",
    price: 2999,
    duration: 365, // 1 year
    features: [
      "Everything in Gold",
      "Dedicated account manager",
      "Early access to new features",
      "Unlimited team members",
      "24/7 chat and call support",
      "Custom SLA & uptime guarantee",
    ],
  },
];

const seedPlans = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    await Plan.deleteMany();
    console.log("🧹 Existing plans cleared");

    const inserted = await Plan.insertMany(plans);
    console.log(`🌱 ${inserted.length} plans inserted successfully\n`);

    inserted.forEach((plan) => {
      console.log(
        `📦 ${plan.name} — ₹${plan.price} / ${plan.duration} days\n  → Features: ${plan.features.length}`
      );
    });

    console.log("\n✅ Plan seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Plan seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedPlans();
