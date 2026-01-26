export default function ListingPaymentModal({
  open,
  onClose,
  onConfirm,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>List Your Property</h3>

        <p>
          To list your property on the marketplace, please pay the listing fee.
        </p>

        <button
          className="btn-pay"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? "Processing..." : "Pay ₹1000 to list your property"}
        </button>

        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
