import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <div className="card">
      <img src={property.main_image || "/no-image.png"} />
      <h3>{property.title}</h3>
      <p>{property.city}</p>
      <p>₹ {property.price}</p>
      <Link to={`/property/${property.id}`}>View</Link>
    </div>
  );
}
