import { Link } from "react-router-dom";
import "../styles/main.css";

export default function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img
        className="property-image"
        src={property.main_image || "/no-image.png"}
        alt={property.title}
      />

      <div className="property-body">
        <h3>{property.title}</h3>
        <p className="property-city">{property.city}</p>
        <p className="property-price">₹ {property.price}</p>

        <Link className="property-link" to={`/property/${property.id}`}>
          View Details
        </Link>
      </div>
    </div>
  );
}
