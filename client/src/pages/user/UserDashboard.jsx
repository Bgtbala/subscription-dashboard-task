import React, { useEffect, useState } from "react";
import { getMySubscription } from "../../api/subscription.api";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaTag,
  FaClock,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

// Helper function for better currency formatting (assuming this exists globally or is imported)
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Helper function for formatting dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const UserDashboard = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      // Catch the error internally to allow `subscription` to be null gracefully
      const data = await getMySubscription().catch(() => null);
      setSubscription(data || null);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // Determine badge color and icon based on status
  const getStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "active":
        return {
          text: "Active",
          class: "bg-success-subtle text-success",
          icon: <FaCheckCircle />,
        };
      case "pending":
        return {
          text: "Pending",
          class: "bg-warning-subtle text-warning",
          icon: <FaClock />,
        };
      case "cancelled":
        return {
          text: "Cancelled",
          class: "bg-danger-subtle text-danger",
          icon: <FaTimesCircle />,
        };
      default:
        return {
          text: status || "Unknown",
          class: "bg-secondary-subtle text-secondary",
          icon: <FaInfoCircle />,
        };
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-xl-12">
          <div className="card shadow-lg border-0">
            {/* CARD HEADER - Clearer separation */}
            <div className="card-header border-0 py-4 px-4">
              <h4 className="fs-24 fw-bold mb-0 text-dark">
                <FaTag className="me-2 text-primary" /> My Subscription Details
              </h4>
            </div>

            <div className="card-body p-4">
              {loading ? (
                <div className="text-center text-primary py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Fetching your subscription details...</p>
                </div>
              ) : !subscription ? (
                <div className="text-center text-muted py-5">
                  <FaTimesCircle className="fs-30 text-danger mb-3" />
                  <p className="fs-18 fw-semibold">
                    You currently have **no active subscription**.
                  </p>
                  <button className="btn btn-primary mt-3">
                    Explore Plans
                  </button>
                </div>
              ) : (
                <div className="row g-4">
                  {/* LEFT SIDE — CURRENT PLAN DETAILS (Data Card Focus) */}
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm p-3">
                      <div className="card-body">
                        <h4 className="mb-4 d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-primary" />{" "}
                          Subscription Summary
                        </h4>

                        {/* PLAN NAME & PRICE - Stronger Hierarchy */}
                        <div className="mb-4 border-bottom pb-3">
                          <span className="badge text-bg-primary fs-16 mb-2 py-2 px-3">
                            {subscription.plan?.name || "N/A"}
                          </span>
                          <p className="fs-24 fw-bold text-dark mb-0">
                            {formatPrice(subscription.plan?.price || 0)}
                            <span className="fs-16 fw-normal text-muted">
                              / month
                            </span>
                          </p>
                        </div>

                        {/* STATUS BADGE - Clear Visual Indicator */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <strong className="text-muted">Status:</strong>
                          <span
                            className={`badge fs-14 py-2 px-3 fw-semibold ${
                              getStatusBadge(subscription.status).class
                            }`}
                          >
                            {getStatusBadge(subscription.status).icon}{" "}
                            {getStatusBadge(subscription.status).text}
                          </span>
                        </div>

                        {/* DATES */}
                        <div className="mb-2">
                          <strong className="text-muted d-block">
                            Start Date:
                          </strong>
                          <span className="fs-16 text-dark">
                            {formatDate(subscription.start_date)}
                          </span>
                        </div>
                        <div className="mb-2">
                          <strong className="text-muted d-block">
                            Renewal Date:
                          </strong>
                          <span className="fs-16 fw-bold text-dark">
                            {formatDate(subscription.end_date)}
                          </span>
                        </div>
                      </div>

                      {/* CTA/Actions */}
                      {/* <div className="card-footer bg-light border-0 pt-3">
                        <button className="btn btn-sm btn-outline-primary me-2">
                          Manage Payment
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          Cancel Subscription
                        </button>
                      </div> */}
                    </div>
                  </div>

                  {/* RIGHT SIDE — PLAN FEATURES (List Card Focus) */}
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm p-3">
                      <div className="card-body">
                        <h4 className="mb-4 d-flex align-items-center border-bottom pb-2">
                          <FaCheckCircle className="me-2 text-success" />{" "}
                          Included Plan Features
                        </h4>

                        {subscription.plan?.features?.length > 0 ? (
                          <ul className="list-group list-group-flush">
                            {subscription.plan.features.map(
                              (feature, index) => (
                                <li
                                  key={index}
                                  className="list-group-item d-flex align-items-center px-0 fs-14"
                                >
                                  <FaCheckCircle className="text-success me-3" />
                                  {feature}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <div className="alert alert-info text-center">
                            No detailed features listed for this plan.
                          </div>
                        )}

                        {/* Action to change plan */}
                        <div className="mt-4 pt-2 border-top">
                          {/* <button className="btn btn-sm btn-info w-100">
                            Compare or Change Plan
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
