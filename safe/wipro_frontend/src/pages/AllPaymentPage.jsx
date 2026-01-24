import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();



  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openMethodId, setOpenMethodId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");


 

  // 🔹 Load ALL active payment methods
  useEffect(() => {
    apiFetch("/payment-methods/")
      .then((res) => {
        setPaymentMethods(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔹 User confirms payment
  const handlePaymentRequest = async (method) => {
  if (!amount || !purpose) {
    alert("Please enter amount and select purpose");
    return;
  }

  try {
    await apiFetch("/all-payment-request/", {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        purpose: purpose,
        payment_method_id: method.id,
      }),
    });

    alert("Payment request submitted. Waiting for admin approval.");
    navigate("/payment-history");
  } catch (err) {
    alert(err.error || "Failed to submit payment");
  }
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
              {/* HEADER */}
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
                    {pm.method_type.toUpperCase()}
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

              {/* BODY */}
              <div
                style={{
                  maxHeight: isOpen ? 500 : 0,
                  overflow: "auto",
                  transition: "max-height 0.6s ease",
                  background: "#f9fafb",
                }}
              >
                <div style={{ padding: 16 }}>
  {/* AMOUNT */}
  <label style={{ fontWeight: 600 }}>Amount</label>
  <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    placeholder="Enter amount"
    style={{
      width: "100%",
      padding: 10,
      marginTop: 6,
      marginBottom: 12,
      borderRadius: 6,
      border: "1px solid #d1d5db",
    }}
  />

  {/* PURPOSE */}
  <label style={{ fontWeight: 600 }}>Purpose</label>
  <select
    value={purpose}
    onChange={(e) => setPurpose(e.target.value)}
    style={{
      width: "100%",
      padding: 10,
      marginTop: 6,
      marginBottom: 16,
      borderRadius: 6,
      border: "1px solid #d1d5db",
    }}
  >
    <option value="">Select purpose</option>
    <option value="loan emi">Loan EMI</option>
    <option value="loan due">Loan Due</option>
    <option value="investment">Investment</option>
    <option value="wallet topup">Wallet Top-up</option>
    <option value="wallet topup">Property listing</option>
  </select>

  {/* PAYMENT DETAILS */}
  {pm.method_type === "upi" && (
    <p><b>UPI ID:</b> {pm.upi_id}</p>
  )}

  {pm.method_type === "bank" && (
    <>
      <p><b>Bank:</b> {pm.bank_name}</p>
      <p><b>Account:</b> {pm.account_number}</p>
      <p><b>IFSC:</b> {pm.ifsc_code}</p>
    </>
  )}

  {pm.method_type === "usdt" && (
    <p><b>USDT Address:</b> {pm.usdt_address}</p>
  )}

  {/* SUBMIT */}
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
    I Have Paid / I Have Withdraw
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