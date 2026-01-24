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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/payment-methods/?for_withdrawal=true")
      .then(setPaymentMethods)
      .finally(() => setLoading(false));
  }, []);

  const submitWithdraw = async () => {
    if (!amount || !methodId || !details) {
      alert("All fields are required");
      return;
    }

    try {
      await apiFetch("/withdraw-request/", {
        method: "POST",
        body: JSON.stringify({
          user_committee_id: userCommitteeId,
          amount: amount,
          payment_method_id: methodId,
          withdrawal_details: details,
        }),
      });

      alert("Withdrawal request submitted");
      navigate(`/payment-history/${userCommitteeId}`);
    } catch (err) {
      alert(err.error || "Failed to submit withdrawal");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Withdraw from Committee</h2>

      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <label>Payment Method</label>
      <select
        value={methodId}
        onChange={(e) => setMethodId(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="">Select method</option>
        {paymentMethods.map((pm) => (
          <option key={pm.id} value={pm.id}>
            {pm.name} ({pm.method_type})
          </option>
        ))}
      </select>

      <label>Withdrawal Details (UPI / Bank / Wallet)</label>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10 }}
      />

      <button
        onClick={submitWithdraw}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 14,
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
        }}
      >
        Request Withdrawal
      </button>
    </div>
  );
}
