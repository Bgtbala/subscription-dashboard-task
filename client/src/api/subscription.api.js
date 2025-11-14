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

// ------------------------------------------
// SUBSCRIBE TO A PLAN (USER)
// ------------------------------------------
export const subscribeToPlan = async (planId) => {
  try {
    const response = await api.post(`/subscribe/${planId}`);
    return response.data?.data;
  } catch (err) {
    throw err;
  }
};

// ------------------------------------------
// GET MY ACTIVE SUBSCRIPTION (USER)
// ------------------------------------------
export const getMySubscription = async () => {
  try {
    const response = await api.get("/my-subscription");
    return response.data?.data;
  } catch (err) {
    throw err;
  }
};

// ------------------------------------------
// GET ALL SUBSCRIPTIONS (ADMIN)
// ------------------------------------------

export const getAllSubscriptions = async (email = "") => {
  const response = await api.get("/admin/subscriptions", {
    params: email ? { email } : {},
  });
  return response.data?.data || [];
};


export const changeUserPlan = async (planId) => {
  console.log("🚀 ~ changeUserPlan ~ planId:", planId)
  try {
    const response = await api.post(`/change-plan/${planId}`);
    console.log("🚀 ~ changeUserPlan ~ response:", response)
    return response.data?.data;
  } catch (error) {
    console.error("Error changing plan:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to change subscription plan";

    throw new Error(message);
  }
};
