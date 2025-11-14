import React, { useEffect, useState, useMemo } from "react";
import { getAllSubscriptions } from "../../api/subscription.api";

// --- Internal Helper Functions and Components ---

/**
 * Formats currency to INR (e.g., ₹10,000)
 */
const formatCurrency = (amount) => {
  return amount ? `₹${amount.toLocaleString("en-IN")}` : "N/A";
};

/**
 * Formats dates (e.g., Nov 14, 2025)
 */
const formatDate = (dateString) => {
  return dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
};

/**
 * Subscription Status Badge Component
 */
const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "unknown").toLowerCase();

  const statusMap = {
    active: { class: "bg-success-subtle text-success", label: "Active" },
    cancelled: { class: "bg-danger-subtle text-danger", label: "Cancelled" },
    pending: { class: "bg-warning-subtle text-warning", label: "Pending" },
    expired: { class: "bg-secondary-subtle text-secondary", label: "Expired" },
    default: { class: "bg-secondary-subtle text-secondary", label: "Unknown" },
  };

  const { class: className, label } =
    statusMap[normalizedStatus] || statusMap["default"];

  return (
    <span
      className={`badge ${className} px-3 py-1 text-uppercase fw-semibold`}
      style={{ fontSize: "0.75rem", minWidth: "80px" }}
      title={`Subscription status: ${label}`}
    >
      {label}
    </span>
  );
};

// --- Main Component ---

const AdminSubscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSubscriptions();
      setSubs(data || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError("Failed to load subscriptions. Please try again.");
      setSubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const subscriptionCount = useMemo(() => subs.length, [subs]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-primary fw-medium">
            Loading Subscriptions...
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger text-center mt-3" role="alert">
          ❌ {error}
          <button
            onClick={loadSubscriptions}
            className="btn btn-sm btn-danger-subtle ms-3"
          >
            Retry
          </button>
        </div>
      );
    }

    if (subscriptionCount === 0) {
      return (
        <div className="text-center text-muted py-5">
          <h5 className="mb-3">No Subscriptions Found</h5>
          <p className="mb-0">
            It looks like there are no active or past subscriptions yet.
          </p>
        </div>
      );
    }

    // Render Table
    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle caption-top">
          <caption>Total: **{subscriptionCount} Subscriptions**</caption>

          <thead className="table-light">
            <tr>
              <th
                scope="col"
                className="text-uppercase small fw-semibold text-muted ps-3"
              >
                User Email
              </th>
              <th
                scope="col"
                className="text-uppercase small fw-semibold text-muted"
              >
                Plan
              </th>
              <th
                scope="col"
                className="text-uppercase small fw-semibold text-muted text-end"
              >
                Price
              </th>
              <th
                scope="col"
                className="text-uppercase small fw-semibold text-muted"
              >
                Start Date
              </th>
              <th
                scope="col"
                className="text-uppercase small fw-semibold text-muted"
              >
                End Date
              </th>
              <th
                scope="col"
                className="text-uppercase small fw-semibold text-muted pe-3"
              >
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {subs.map((sub) => (
              <tr key={sub._id}>
                {/* User Information */}
                <td className="fw-medium text-dark-emphasis ps-3">
                  {sub.user?.email || "**Unknown User**"}
                </td>

                {/* Plan Name */}
                <td className="fw-medium text-dark-emphasis">
                  {sub.plan?.name || "N/A"}
                </td>

                {/* Price (Right Aligned) */}
                <td className="fw-semibold text-success text-end">
                  {formatCurrency(sub.plan?.price)}
                </td>

                {/* Dates */}
                <td className="text-muted">{formatDate(sub.start_date)}</td>
                <td className="text-muted">{formatDate(sub.end_date)}</td>

                {/* Status Badge */}
                <td className="pe-3">
                  <StatusBadge status={sub.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header border-bottom d-flex justify-content-between align-items-center py-3">
        <h3 className="fs-5 fw-bold text-dark mb-0">
          📜 All Subscriptions
          {!loading && subscriptionCount > 0 && (
            <span className="badge bg-secondary-subtle text-secondary ms-2">
              {subscriptionCount}
            </span>
          )}
        </h3>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={loadSubscriptions}
          disabled={loading}
          title="Refresh subscription data"
        >
          <i className={`bi bi-arrow-clockwise ${loading ? "spin" : ""}`}></i>{" "}
          Refresh
        </button>
      </div>

      <div className="card-body p-0">{renderContent()}</div>
    </div>
  );
};

export default AdminSubscriptions;
