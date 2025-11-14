import React, { useEffect, useState } from "react";
import { getAllPlans } from "../../api/plan.api";
import { toast } from "react-toastify";
import { getMySubscription, changeUserPlan } from "../../api/subscription.api";
import {
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaShoppingCart,
  FaInfoCircle,
} from "react-icons/fa"; // Using React Icons for better visual appeal

// Helper function for better currency formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);
};

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [myPlan, setMyPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------- Fetch plans + my subscription ----------------------------- */
  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch all plans and my subscription in parallel for efficiency
      const [allPlans, mySub] = await Promise.all([
        getAllPlans(),
        getMySubscription().catch(() => null), // may not exist
      ]);

      setPlans(allPlans || []);
      setMyPlan(mySub?.plan || null);
    } catch (error) {
      console.error("Error loading plans:", error);
      toast.error("Failed to load plans or subscription data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ----------------------------- Change Plan ----------------------------- */
  const handleChangePlan = async (planId) => {
    try {
      // Basic client-side check to prevent re-subscription to the current plan
      if (myPlan?._id === planId) {
        toast.info("This is your current active plan.");
        return;
      }

      await changeUserPlan(planId);
      toast.success("Plan updated successfully!");
      loadData(); // Re-fetch data to update the UI state
    } catch (err) {
      console.log("🚀 ~ handleChangePlan ~ err:", err);
      // Display a more user-friendly error message if available
      toast.error(err.message || "Failed to change plan. Please try again.");
    }
  };

  /**
   * Renders a visually appealing badge for the plan state.
   * @param {object} plan The current plan object being rendered.
   * @param {boolean} isCurrent Is this the active plan?
   * @param {boolean} isUpgrade Is this an upgrade path?
   * @param {boolean} isDowngrade Is this a downgrade path?
   */
  const renderPlanBadge = (plan, isCurrent, isUpgrade, isDowngrade) => {
    if (isCurrent) {
      return (
        <span
          className="badge bg-success-subtle text-success fs-12 fw-bold"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "0.5rem 0.75rem",
          }}
        >
          <FaCheckCircle className="me-1" /> Active Plan
        </span>
      );
    }
    // Only show actionable badges for non-current plans if there is an existing plan
    if (myPlan) {
      if (isUpgrade) {
        return (
          <span
            className="badge bg-primary-subtle text-primary fs-12 fw-bold"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              padding: "0.5rem 0.75rem",
            }}
          >
            <FaArrowUp className="me-1" /> Upgrade
          </span>
        );
      }
      if (isDowngrade) {
        return (
          <span
            className="badge bg-warning-subtle text-warning fs-12 fw-bold"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              padding: "0.5rem 0.75rem",
            }}
          >
            <FaArrowDown className="me-1" /> Downgrade
          </span>
        );
      }
    }
    // No badge for non-current, non-actionable (if no plan), or same-price plans
    return null;
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-xl-12">
          <div className="card shadow-lg border-0">
            <div className="card-header border-0 py-4 px-4 d-flex justify-content-between align-items-center">
              <h4 className="fs-24 fw-bold mb-0 text-dark">Pricing Plans</h4>

              {/* Show current plan text - improved visual contrast/clarity */}
              {myPlan ? (
                <span className="badge bg-success-subtle text-success fs-14 fw-semibold py-2 px-3">
                  <FaInfoCircle className="me-2" /> Current Plan:{" "}
                  <strong className="text-success">{myPlan.name}</strong>
                </span>
              ) : (
                <span className="badge bg-warning-subtle text-warning fs-14 fw-semibold py-2 px-3">
                  <FaInfoCircle className="me-2" /> No active subscription
                </span>
              )}
            </div>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center text-primary w-100 py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading plans...</span>
                  </div>
                  <p className="mt-3">Fetching the latest pricing details...</p>
                </div>
              ) : (
                <div className="row g-4">
                  {plans.length === 0 && !loading ? (
                    <div className="col-12 text-center py-5">
                      <p className="fs-18 text-muted">
                        No pricing plans are currently available.
                      </p>
                    </div>
                  ) : (
                    plans
                      // Sort plans by price for logical display (low to high)
                      .sort((a, b) => a.price - b.price)
                      .map((plan) => {
                        const isCurrent = myPlan?._id === plan._id;
                        const isUpgrade =
                          !isCurrent && myPlan && plan.price > myPlan.price;
                        const isDowngrade =
                          !isCurrent && myPlan && plan.price < myPlan.price;
                        const actionText = !myPlan
                          ? "Subscribe"
                          : isUpgrade
                          ? "Upgrade"
                          : isDowngrade
                          ? "Downgrade"
                          : "Select Plan";
                        const buttonClass =
                          !myPlan || isUpgrade
                            ? "btn-primary"
                            : isDowngrade
                            ? "btn-warning"
                            : "btn-outline-secondary disabled";
                        const isDisabled = isCurrent;

                        return (
                          <div
                            key={plan._id}
                            className="col-xl-4 col-lg-6 col-md-6"
                          >
                            <div
                              className={`card h-100 ${
                                isCurrent
                                  ? "border-3 border-primary shadow-lg"
                                  : "border shadow-sm"
                              }`}
                              style={{ transition: "all 0.3s" }}
                            >
                              <div
                                className="card-body p-4"
                                style={{ position: "relative" }}
                              >
                                {/* BADGE (Upgrade/Downgrade/Active) */}
                                {renderPlanBadge(
                                  plan,
                                  isCurrent,
                                  isUpgrade,
                                  isDowngrade
                                )}

                                {/* PLAN NAME */}
                                <h5 className="fs-22 fw-bold mb-2 text-dark">
                                  {plan.name}
                                </h5>

                                {/* PRICE */}
                                <div className="d-flex align-items-center mb-3">
                                  <span className="fs-36 fw-bolder text-primary me-2">
                                    {formatPrice(plan.price)}
                                  </span>
                                  <span className="text-muted">/ month</span>
                                </div>

                                {/* DURATION & FEATURE COUNT */}
                                <div className="mb-4">
                                  <p className="mb-1 text-muted fs-14">
                                    <FaCheckCircle className="text-success me-1" />{" "}
                                    **{plan.duration} days** access
                                  </p>
                                  <p className="mb-0 text-muted fs-14">
                                    <FaCheckCircle className="text-success me-1" />{" "}
                                    **{plan.features?.length} unique features**
                                    included
                                  </p>
                                </div>

                                <hr />

                                {/* FEATURE LIST (Added for UX clarity) */}
                                {plan.features && plan.features.length > 0 && (
                                  <ul className="list-unstyled mb-4">
                                    {plan.features
                                      .slice(0, 3)
                                      .map((feature, index) => (
                                        <li
                                          key={index}
                                          className="fs-14 text-dark mb-2"
                                        >
                                          <FaCheckCircle className="text-success me-2" />
                                          {feature}
                                        </li>
                                      ))}
                                    {plan.features.length > 3 && (
                                      <li className="fs-14 text-muted mt-2">
                                        ... and {plan.features.length - 3} more
                                        features
                                      </li>
                                    )}
                                  </ul>
                                )}

                                {/* ACTIONS - Improved CTA */}
                                <div className="mt-auto pt-3">
                                  <button
                                    className={`btn w-100 btn-lg ${buttonClass} ${
                                      isCurrent ? "text-dark" : ""
                                    }`}
                                    onClick={() => handleChangePlan(plan._id)}
                                    disabled={isDisabled}
                                  >
                                    <FaShoppingCart className="me-2" />
                                    {isCurrent ? "Current Plan" : actionText}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
