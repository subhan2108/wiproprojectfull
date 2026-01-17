import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import PropertyCard from "../components/PropertyCard";
import "../styles/main.css"

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/properties/")
      .then((data) => {
        // ✅ DRF pagination fix
        setProperties(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading properties...</p>;

  return (
     <div className="properties-page">
      <div className="properties-container">

        {/* Header */}
        <div className="properties-header">
          <h1>Property Marketplace</h1>
          <p>Browse, buy, or invest in premium properties</p>
        </div>

        {/* Error */}
        {error && <p className="properties-error">{error}</p>}

        {/* Empty State */}
        {properties.length === 0 ? (
          <div className="properties-empty">
            <p>No properties found</p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
