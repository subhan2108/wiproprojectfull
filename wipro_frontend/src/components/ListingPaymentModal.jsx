import "./ListingPaymentModal.css";
import { useNavigate } from "react-router-dom";

export default function ListingPaymentModal({
  open,
  onClose,
  onSuccess, // optional, kept for backward compatibility
  loading,
}) {
  const navigate = useNavigate();

  if (!open) return null;

  const handlePay = () => {
    // Navigate to payment page
    navigate("/pay", {
      state: {
        purpose: "property_listing",
        amount: 1000,
        request_type: "deposit",
      },
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>List Property</h3>

        <p>
          To list your property on the main marketplace, you need to pay a
          <strong> ₹1000 listing fee</strong>.
        </p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-pay"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay ₹1000"}
          </button>
        </div>
      </div>
    </div>
  );
}
