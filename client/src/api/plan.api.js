// src/api/plan.api.js
import { api } from "../utils/axios";

// ------------------------------------------
// GET ALL PLANS (PUBLIC)
// ------------------------------------------
export const getAllPlans = async () => {
  try {
    const response = await api.get("/plans");
    return response.data?.data;
  } catch (err) {
    throw err;
  }
};
