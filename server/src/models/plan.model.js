import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Plan price is required"],
      min: [0, "Price cannot be negative"],
    },
    features: {
      type: [String],
      required: [true, "At least one feature is required"],
      validate: [(arr) => arr.length > 0, "Features cannot be empty"],
    },
    duration: {
      type: Number, // in days
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"],
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
