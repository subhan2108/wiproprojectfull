import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import "./PropertyDetailContent.css";
import { useNavigate } from "react-router-dom";

export default function PropertyDetailContent({ propertyId }) {
  const [property, setProperty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/properties/${propertyId}/`).then(setProperty);
  }, [propertyId]);

  if (!property) return <p>Loading...</p>;

  // 🧠 Decide which status to show
  const displayStatus = property.user_request_status
    ? `YOUR REQUEST: ${property.user_request_status.toUpperCase()}`
    : property.status.toUpperCase();

  const statusClass =
    property.user_request_status || property.status;

  return (
    <div className="property-modal">
      {/* ================= HEADER ================= */}
      <div className="pd-header">
        <div className="pd-header-left">
          <h2 className="pd-title">{property.title}</h2>
          <p className="pd-location">
            <i className="bi bi-geo-alt"></i>{" "}
            {property.location}, {property.city}
          </p>
        </div>

        <div className="pd-header-right">
          <div className="pd-price">₹ {property.price}</div>

          {/* ✅ USER-AWARE STATUS */}
          <span className={`pd-status ${statusClass}`}>
            {displayStatus}
          </span>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="pd-card">
        <div className="pd-grid">
          <div>
            <i className="bi bi-house"></i>
            <span>{property.property_type}</span>
          </div>
          <div>
            <i className="bi bi-tag"></i>
            <span>{property.listing_type}</span>
          </div>
          <div>
            <i className="bi bi-aspect-ratio"></i>
            <span>{property.area_sqft} sqft</span>
          </div>
          <div>
            <i className="bi bi-door-open"></i>
            <span>{property.bedrooms} Beds</span>
          </div>
          <div>
            <i className="bi bi-droplet"></i>
            <span>{property.bathrooms} Baths</span>
          </div>
          <div>
            <i className="bi bi-eye"></i>
            <span>{property.views_count} Views</span>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="pd-card">
        <h4>Description</h4>
        <p>{property.description}</p>
      </div>

      {/* ================= ACTION ================= */}
      <div className="pd-card">
        <h4>Interested in this property?</h4>

        {/* ✅ BUTTON LOGIC */}
        {property.user_request_status === "pending" ? (
          <button className="pd-btn disabled" disabled>
            Request Pending
          </button>
        ) : property.user_request_status === "approved" ? (
          <button className="pd-btn success" disabled>
            Request Approved
          </button>
        ) : property.user_request_status === "rejected" ? (
          <button
            className="pd-btn"
            onClick={() => navigate(`/property/${propertyId}/request`)}
          >
            Re-apply / Contact Owner
          </button>
        ) : (
          <button
            className="pd-btn"
            onClick={() => navigate(`/property/${propertyId}/request`)}
          >
            Contact Owner / Buy Property
          </button>
        )}

        {/* ✅ USER MESSAGE */}
        <p className="pd-note">
          {property.user_request_status === "pending" &&
            "⏳ Your request is under review by the owner."}

          {property.user_request_status === "approved" &&
            "✅ Your request was approved. Owner will contact you."}

          {property.user_request_status === "rejected" &&
            "❌ Your request was rejected. You may submit a new request."}

          {!property.user_request_status &&
            "Fill a short form. Owner will review your request."}
        </p>
      </div>
    </div>
  );
}
