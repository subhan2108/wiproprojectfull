import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function PaymentPage() {
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openMethodId, setOpenMethodId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [requestType, setRequestType] = useState(""); // deposit / withdraw
  const [withdrawalDetails, setWithdrawalDetails] = useState(""); // ✅ NEW
  const [screenshot, setScreenshot] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Load payment methods
  useEffect(() => {
    apiFetch("/payment-methods/")
      .then((res) => {
        setPaymentMethods(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePaymentRequest = async (method) => {
    // 🔐 FRONTEND VALIDATION
    if (!amount || !requestType || !screenshot) {
      setError("Amount, type and payment screenshot are required");
      return;
    }

    if (requestType === "withdraw" && !withdrawalDetails) {
      setError("Please enter your withdrawal details");
      return;
    }

    setError("");

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("request_type", requestType);
      formData.append("payment_method_id", method.id);
      formData.append("payment_screenshot", screenshot);

      // ✅ ONLY FOR WITHDRAW
      if (requestType === "withdraw") {
        formData.append("withdrawal_details", withdrawalDetails);
      }

      await apiFetch("/all-payment-request/", {
        method: "POST",
        body: formData,
      });

      alert("Payment request submitted. Waiting for admin approval.");
      navigate("/payment-history");
    } catch (err) {
      alert(err?.error || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h2>Make Payment</h2>

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
                  maxHeight: isOpen ? 650 : 0,
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

                  {/* TYPE */}
                  <label style={{ fontWeight: 600 }}>
                    Payment Type
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => {
                      setRequestType(e.target.value);
                      setWithdrawalDetails("");
                    }}
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                      marginBottom: 16,
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                    }}
                  >
                    <option value="">Select type</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                  </select>

                  {/* 🔥 ONLY FOR WITHDRAW */}
                  {requestType === "withdraw" && (
                    <>
                      <div
                        style={{
                          padding: 12,
                          background: "#fff7ed",
                          border: "1px solid #fed7aa",
                          borderRadius: 8,
                          marginBottom: 12,
                        }}
                      >
                        {pm.method_type === "upi" && <b>UPI Withdrawal</b>}
                        {pm.method_type === "bank" && <b>Bank Transfer</b>}
                        {pm.method_type === "usdt" && <b>USDT / Crypto</b>}
                      </div>

                      <label style={{ fontWeight: 600 }}>
                        Your Withdrawal Details
                      </label>
                      <textarea
                        value={withdrawalDetails}
                        onChange={(e) =>
                          setWithdrawalDetails(e.target.value)
                        }
                        rows={3}
                        placeholder="Enter your UPI ID / Bank details / Wallet address"
                        style={{
                          width: "100%",
                          padding: 10,
                          marginTop: 6,
                          marginBottom: 16,
                          borderRadius: 6,
                          border: "1px solid #d1d5db",
                        }}
                      />
                    </>
                  )}

                  {/* PAYMENT INFO */}
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

                  {/* SCREENSHOT */}
                  <label style={{ fontWeight: 600, marginTop: 12 }}>
                    Payment Screenshot (required)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setScreenshot(e.target.files[0]);
                      setError("");
                    }}
                    style={{ marginTop: 6 }}
                  />

                  {error && (
                    <p style={{ color: "red", marginTop: 8 }}>
                      {error}
                    </p>
                  )}

                  {/* SUBMIT */}
                  <button
                    disabled={
                      submitting ||
                      !screenshot ||
                      (requestType === "withdraw" && !withdrawalDetails)
                    }
                    onClick={() => handlePaymentRequest(pm)}
                    style={{
                      marginTop: 18,
                      width: "100%",
                      padding: 14,
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 16,
                      cursor: "pointer",
                      opacity:
                        submitting ||
                        (requestType === "withdraw" && !withdrawalDetails)
                          ? 0.6
                          : 1,
                    }}
                  >
                    {submitting ? "Submitting..." : "I Have Paid"}
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
