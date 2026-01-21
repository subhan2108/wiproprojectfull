import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function PaymentPage() {
  const { userCommitteeId } = useParams();
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openMethodId, setOpenMethodId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/committee-detail/${userCommitteeId}/`)
      .then((res) => {
        setPaymentMethods(res.payment_methods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userCommitteeId]);

  const handlePaymentRequest = async (method) => {
    await apiFetch("/payment-request/", {
      method: "POST",
      body: JSON.stringify({
        user_committee_id: userCommitteeId,
        payment_method_id: method.id,
      }),
    });

    navigate(`/payment-history/${userCommitteeId}`);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h2>Make Payment</h2>

      {/* PAYMENT METHODS LIST */}
      <div style={{ marginTop: 20 }}>
        {paymentMethods.map((pm) => {
          const isOpen = openMethodId === pm.id;

          return (
            <div
              key={pm.id}
              style={{
                marginBottom: 14,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              {/* HEADER ROW */}
              <div
                onClick={() =>
                  setOpenMethodId(isOpen ? null : pm.id)
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  cursor: "pointer",
                  background: isOpen ? "#ecfdf5" : "#ffffff",
                }}
              >
                <div>
                  <h4 style={{ marginBottom: 4 }}>{pm.name}</h4>
                  <p style={{ fontSize: 14, color: "#6b7280" }}>
                    {pm.type.toUpperCase()}
                  </p>
                </div>

                <span
                  style={{
                    fontSize: 18,
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                >
                  ›
                </span>
              </div>

              {/* DROPDOWN BODY */}
              <div
                style={{
                  maxHeight: isOpen ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                  background: "#f9fafb",
                }}
              >
                <div style={{ padding: 16 }}>
                  {pm.type === "upi" && (
                    <p>
                      <b>UPI ID:</b> {pm.details.upi}
                    </p>
                  )}

                  {pm.type === "bank" && (
                    <>
                      <p>
                        <b>Bank:</b> {pm.details.bank}
                      </p>
                      <p>
                        <b>Account:</b> {pm.details.account}
                      </p>
                      <p>
                        <b>IFSC:</b> {pm.details.ifsc}
                      </p>
                    </>
                  )}

                  {pm.type === "usdt" && (
                    <p>
                      <b>USDT Address:</b> {pm.details.usdt}
                    </p>
                  )}

                  <button
                    onClick={() => handlePaymentRequest(pm)}
                    style={{
                      marginTop: 14,
                      width: "100%",
                      padding: 14,
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    I Have Paid
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}