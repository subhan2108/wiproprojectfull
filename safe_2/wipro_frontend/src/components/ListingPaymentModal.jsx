import "./ListingPaymentModal.css";
import { useNavigate } from "react-router-dom";

export default function ListingPaymentModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handlePay = () => {
    navigate("/pay", {
      state: {
        purpose: "property_listing",
        amount: 1000,
      },
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>List Your Property</h3>

        <p>
          To list your property on the marketplace, please pay the listing fee.
        </p>

        <button className="btn-pay" onClick={handlePay}>
          Pay ₹1000 to list your property
        </button>

        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
