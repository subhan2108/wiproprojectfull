import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://wiproadmin.onrender.com/api/properties/";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // 🚨 If backend sends HTML instead of JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Backend did not return JSON");
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // DRF pagination safe handling
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (Array.isArray(data.results)) {
          setProperties(data.results);
        } else {
          setProperties([]);
        }
      } catch (err) {
        console.error("Property fetch failed:", err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="property-list-container">
      <h1>Properties</h1>

      <Link to="/my-properties/new" className="btn btn-primary">
        + Add Property
      </Link>

      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                {property.images?.[0]?.image ? (
                  <img
                    src={property.images[0].image}
                    alt={property.title}
                  />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>

              <div className="property-content">
                <h3>{property.title}</h3>
                <p className="property-location">{property.location}</p>
                <p className="property-price">
                  ₹{Number(property.price || 0).toLocaleString()}
                </p>
                <p className="property-description">
                  {property.description?.slice(0, 100) || "No description"}…
                </p>

                <Link
                  to={`/properties/${property.id}`}
                  className="btn btn-secondary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
