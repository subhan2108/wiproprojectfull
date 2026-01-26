import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function CommitteeWithdraw() {
  const { userCommitteeId } = useParams();
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [amount, setAmount] = useState("");
  const [methodId, setMethodId] = useState("");
  const [details, setDetails] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔒 STATIC PAYMENT METHODS (UI CONTROLLED)
  const STATIC_METHODS = [
    { type: "upi", label: "UPI" },
    { type: "bank", label: "Bank Transfer" },
    { type: "usdt", label: "USDT" },
  ];

  // 🔄 FETCH BACKEND METHODS (ONLY FOR ID MAPPING)
  useEffect(() => {
    apiFetch("/payment-methods/?for_withdrawal=true")
      .then((data) => setPaymentMethods(data))
      .finally(() => setLoading(false));
  }, []);

  // 🔁 MAP BACKEND METHODS BY TYPE
  const methodByType = paymentMethods.reduce((acc, m) => {
    acc[m.method_type] = m;
    return acc;
  }, {});

  const submitWithdraw = async () => {
    // 🔐 FRONTEND VALIDATION
    if (!amount || !methodId || !details || !screenshot) {
      setError("All fields including payment screenshot are required");
      return;
    }

    setError("");

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("user_committee_id", userCommitteeId);
      formData.append("amount", amount);
      formData.append("payment_method_id", methodId);
      formData.append("withdrawal_details", details);
      formData.append("payment_screenshot", screenshot);

      await apiFetch("/withdraw-request/", {
        method: "POST",
        body: formData, // 🔥 multipart/form-data
      });

      alert("Withdrawal request submitted");
      navigate(`/payment-history/${userCommitteeId}`);
    } catch (err) {
      alert(err?.error || "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Withdraw from Committee</h2>

      {/* AMOUNT */}
      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* PAYMENT METHOD (STATIC UI) */}
      <label>Payment Method</label>
      <select
        value={methodId}
        onChange={(e) => setMethodId(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="">Select method</option>

        {STATIC_METHODS.map((m) => {
          const backendMethod = methodByType[m.type];
          if (!backendMethod) return null;

          return (
            <option key={m.type} value={backendMethod.id}>
              {m.label}
            </option>
          );
        })}
      </select>

      {/* WITHDRAWAL DETAILS */}
      <label>Withdrawal Details (UPI / Bank / Wallet)</label>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* SCREENSHOT (MANDATORY) */}
      <label>Payment Screenshot (required)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setScreenshot(e.target.files[0]);
          setError("");
        }}
        style={{ width: "100%", marginBottom: 8 }}
      />

      {error && (
        <p style={{ color: "red", fontSize: 14, marginBottom: 8 }}>
          {error}
        </p>
      )}

      {/* SUBMIT */}
      <button
        onClick={submitWithdraw}
        disabled={submitting || !screenshot}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 14,
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: submitting || !screenshot ? "not-allowed" : "pointer",
          opacity: submitting || !screenshot ? 0.6 : 1,
        }}
      >
        {submitting ? "Submitting..." : "Request Withdrawal"}
      </button>
    </div>
  );
}
