import "./ListingPaymentModal.css";

export default function ListingPaymentModal({
  open,
  onClose,
  onSuccess,
  loading,
}) {
  if (!open) return null;

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
            onClick={onSuccess}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay ₹1000"}
          </button>
        </div>
      </div>
    </div>
  );
}
