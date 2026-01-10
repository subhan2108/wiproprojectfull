import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="container">
      <h1>Properties</h1>

      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <div className="grid">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
