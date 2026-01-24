import "./ListingPaymentModal.css";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

export default function ListingPaymentModal({
  open,
  onClose,
  onSuccess,
  loading,
}) {
  const navigate = useNavigate();
  const { formatPrice, currency } = useCurrency();

  const LISTING_FEE = 1000; // INR base

  if (!open) return null;

  const handlePay = () => {
    navigate("/pay", {
      state: {
        purpose: "property_listing",
        amount: LISTING_FEE, // 🔥 STILL INR
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
          <strong> {formatPrice(LISTING_FEE)} listing fee</strong>.
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
            {loading
              ? "Processing..."
              : `Pay ${formatPrice(LISTING_FEE)}`}
          </button>
        </div>

        {currency !== "INR" && (
          <small className="currency-note">
            * You will be charged in INR at checkout
          </small>
        )}
      </div>
    </div>
  );
}
