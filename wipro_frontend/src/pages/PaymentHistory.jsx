import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { formatPrice, currency } = useCurrency();

  useEffect(() => {
    apiFetch("/payment-history/")
      .then((res) => {
        setPayments(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
            <strong>{formatPrice(p.amount)}</strong>
            <StatusBadge status={p.status} />
          </div>

          <p><b>Method:</b> {p.payment_method || "—"}</p>

          <p>
            <b>Purpose:</b>{" "}
            {p.purpose.replace("_", " ").toUpperCase()}
          </p>

          <p><b>Date:</b> {p.created_at}</p>

          {p.admin_message && (
            <p style={{ marginTop: 8 }}>
              <b>Admin:</b> {p.admin_message}
            </p>
          )}

          {currency !== "INR" && (
            <small style={{ color: "#6b7280" }}>
              * Charged in INR
            </small>
          )}
        </div>
      ))}
    </div>
  );
}
