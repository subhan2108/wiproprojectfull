import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  const [amount, setAmount] = useState("");
  const [userPaymentMethod, setUserPaymentMethod] = useState("");
  const [withdrawalDetails, setWithdrawalDetails] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 Fetch wallet summary (NET BALANCE) */
  useEffect(() => {
    apiFetch("/me/")
      .then((res) => {
        setWallet(res);
        setLoadingWallet(false);
      })
      .catch(() => setLoadingWallet(false));
  }, []);

  const handleWithdraw = async () => {
    if (!amount || !userPaymentMethod || !withdrawalDetails) {
      setError("All fields are required");
      return;
    }

    if (wallet && Number(amount) > Number(wallet.net_balance)) {
      setError("Withdrawal amount exceeds available balance");
      return;
    }

    setError("");

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("request_type", "withdraw");
      formData.append("user_payment_method", userPaymentMethod);
      formData.append("withdrawal_details", withdrawalDetails);

      await apiFetch("/all-payment-request/", {
        method: "POST",
        body: formData,
      });

      alert("Withdrawal request submitted. Awaiting admin approval.");
      navigate("/payment-history");
    } catch (err) {
      alert(err?.error || "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingWallet) {
    return <p style={{ padding: 40 }}>Loading wallet...</p>;
  }

  /* 🔹 Dynamic labels */
  const getLabel = () => {
    if (userPaymentMethod === "upi") return "Enter your UPI ID";
    if (userPaymentMethod === "bank") return "Enter your Bank Details";
    if (userPaymentMethod === "usdt") return "Enter your USDT Wallet Address";
    return "";
  };

  const getPlaceholder = () => {
    if (userPaymentMethod === "upi") return "example@upi";
    if (userPaymentMethod === "bank")
      return "Account Holder Name, Account Number, IFSC, Bank Name";
    if (userPaymentMethod === "usdt")
      return "USDT wallet address (TRC20 / ERC20)";
    return "";
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 30 }}>
      <h2>Withdraw Funds</h2>

      {/* 🔥 NET BALANCE */}
      {wallet && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "#065f46" }}>
            Available Balance
          </p>
          <h3 style={{ marginTop: 6 }}>
            {formatPrice(wallet.net_balance, currency)}
          </h3>
        </div>
      )}

      {/* AMOUNT */}
      <label style={{ fontWeight: 600 }}>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter withdrawal amount"
        style={{
          width: "100%",
          padding: 10,
          marginTop: 6,
          marginBottom: 16,
          borderRadius: 6,
          border: "1px solid #d1d5db",
        }}
      />

      {/* WITHDRAW METHOD */}
      <label style={{ fontWeight: 600 }}>Withdrawal Method</label>
      <select
        value={userPaymentMethod}
        onChange={(e) => {
          setUserPaymentMethod(e.target.value);
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
        <option value="">Select method</option>
        <option value="upi">UPI</option>
        <option value="bank">Bank Transfer</option>
        <option value="usdt">USDT</option>
      </select>

      {/* 🔥 CONDITIONAL TEXTAREA */}
      {userPaymentMethod && (
        <>
          <label style={{ fontWeight: 600 }}>{getLabel()}</label>
          <textarea
            value={withdrawalDetails}
            onChange={(e) => setWithdrawalDetails(e.target.value)}
            rows={4}
            placeholder={getPlaceholder()}
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

      {error && (
        <p style={{ color: "red", marginBottom: 12 }}>
          {error}
        </p>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleWithdraw}
        disabled={submitting}
        style={{
          width: "100%",
          padding: 14,
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Submitting..." : "Request Withdrawal"}
      </button>
    </div>
  );
}
