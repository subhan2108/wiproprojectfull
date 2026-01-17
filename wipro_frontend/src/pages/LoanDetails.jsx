import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";


const LoanDetails = () => {
  const [data, setData] = useState(null);
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // ✅ normal async function (NO hooks)
  const loadLoan = async () => {
    const res = await apiFetch("/loans/user-loan/");
    setData(res);
  };

  // ✅ normal async function (NO hooks)
  const loadEmis = async () => {
    const res = await apiFetch("/loans/emis/");
    if (res.has_loan) {
      setEmis(res.emis);
    }
  };

  // ✅ hooks ONLY here
  useEffect(() => {
    const loadAll = async () => {
      try {
        await loadLoan();
        await loadEmis();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const payEmi = (emi) => {
  navigate("/pay", {
    state: {
      payment_id: emi.id,
    },
  });
};


  if (loading) return <p>Loading...</p>;
  if (!data || !data.has_loan) return <p>No active loan found.</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "50px auto" }}>
      <h2>Loan Wallet</h2>

      {/* 🔹 3 BOXES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 30,
        }}
      >
        <div className="wallet-box">
          <p>Loan Amount</p>
          <h2>₹{data.loan_amount}</h2>
        </div>

        <div className="wallet-box">
          <p>Amount Paid</p>
          <h2>₹{data.amount_paid}</h2>
        </div>

        <div className="wallet-box highlight">
          <p>EMI Amount</p>
          <h2>₹{data.emi_amount}</h2>
        </div>
      </div>

      {/* 🔹 EMI TABLE */}
      <h3 style={{ marginTop: 40 }}>EMI Schedule</h3>

      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {emis.map((emi) => (
            <tr key={emi.id}>
              <td>{emi.due_date}</td>
              <td>₹{emi.amount}</td>
              <td>{emi.status}</td>
              <td>
                {emi.status === "pending" ? (
                  <button
                    onClick={() => payEmi(emi)}
                    style={{
                      background: "#22c55e",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Pay Now
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanDetails;
