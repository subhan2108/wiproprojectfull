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
  const { currency } = useCurrency(); // ✅ ONLY what exists

  const LISTING_FEE_INR = 1000;

  // ✅ Local conversion (NO context change)
  const getDisplayPrice = () => {
    if (currency === "USD") {
      return `$${(LISTING_FEE_INR / 89).toFixed(2)}`;
    }
    return `₹${LISTING_FEE_INR}`;
  };

  if (!open) return null;

  const handlePay = () => {
    navigate("/pay", {
      state: {
        purpose: "property_listing",
        amount: LISTING_FEE_INR, // ✅ ALWAYS INR
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
          <strong> {getDisplayPrice()} listing fee</strong>.
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
            {loading ? "Processing..." : `Pay ${getDisplayPrice()}`}
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
