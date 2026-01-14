import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function PaymentHistory() {
  const { userCommitteeId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/payment-history/${userCommitteeId}/`)
      .then((res) => {
        setPayments(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userCommitteeId]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 30 }}>
      <h2>Payment History</h2>

      {payments.length === 0 && <p>No payments yet</p>}

      {payments.map((p) => (
        <div
          key={p.id}
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>₹{p.amount}</strong>
            <StatusBadge status={p.status} />
          </div>

          <p><b>Method:</b> {p.payment_method}</p>
          <p><b>Type:</b> {p.transaction_type}</p>
          <p><b>Date:</b> {p.created_at}</p>

          {p.admin_message && (
            <p style={{ marginTop: 8 }}>
              <b>Admin:</b> {p.admin_message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "#facc15",
    approved: "#22c55e",
    rejected: "#ef4444",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        color: "#fff",
        background: colors[status],
        fontSize: 12,
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}
