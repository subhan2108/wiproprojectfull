import React, { useEffect, useState } from "react";
import "./Wallet.css";
import { apiFetch } from "../api/api";


const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    apiFetch("/me/")
      .then((res) => {
        setWallet(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
  apiFetch("/wallet-payments/")
    .then((res) => {
      console.table(res);
      setTransactions(res);
    })
    .catch((err) => console.error(err));
}, []);



  if (loading) return <p style={{ padding: 40 }}>Loading wallet...</p>;
  if (!wallet) return <p style={{ padding: 40 }}>Failed to load wallet</p>;

  return (
    <div className="wallet-container">
      {/* Header */}
      <div className="wallet-header">
        <span className="security-badge">INSTITUTIONAL GRADE SECURITY</span>
        <h1>
          My <span>Vault.</span>
        </h1>
      </div>

      {/* Portfolio Card (Net Balance) */}
      <div className="portfolio-card">
        <div>
          <p className="label">GLOBAL PORTFOLIO VALUE</p>
          <h2>₹{wallet.net_balance}</h2>
          <div className="portfolio-meta">
            <span className="growth">LIVE CALCULATED</span>
            <span className="instant">INSTANT PAYOUTS</span>
          </div>
        </div>

        <div className="actions">
          <button className="deposit-btn">＋ DEPOSIT</button>
          <button className="withdraw-btn">↙ WITHDRAW</button>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="stats-grid">
        {/* TOTAL INVESTED */}
        <div className="stat-card">
          <p>TOTAL DEPOSIT</p>
          <h3>₹{wallet.total_invested}</h3>
          <small>Coming Soon</small>
        </div>

        {/* TOTAL WITHDRAWN */}
        <div className="stat-card">
          <p>TOTAL WITHDRAW</p>
          <h3>₹{wallet.total_withdrawn}</h3>
          <small>Coming Soon</small>
        </div>

        {/* BONUS BALANCE (EMPTY FOR NOW) */}
        <div className="stat-card">
          <p>BONUS BALANCE</p>
          <h3 className="green">₹{wallet.bonus_balance}</h3>
          <small>Coming Soon</small>
        </div>
      </div>

      {/* 🔥 NEW ROW: EARNED / PAID / NET */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>TOTAL EARNED</p>
          <h3 className="green">₹{wallet.total_earned}</h3>
          <small>Coming Soon</small>
        </div>

        <div className="stat-card">
          <p>TOTAL PAID</p>
          <h3 className="red">₹{wallet.total_paid}</h3>
          <small>Coming Soon</small>
        </div>

        <div className="stat-card highlight">
          <p>NET BALANCE</p>
          <h3>₹{wallet.net_balance}</h3>
          <small>Coming Soon</small>
        </div>
      </div>

      {/* Transaction History */}
<div className="transaction-box">
  <h4>ASSET TRANSACTION HISTORY</h4>

  {transactions.length === 0 && (
    <p style={{ padding: "10px 0", color: "#999" }}>
      No transactions found
    </p>
  )}

  {transactions.map((tx) => (
    <div className="transaction" key={tx.id}>
      <div>
        <small>{tx.created_at}</small>
        <p>{tx.payment_method}</p>
      </div>

      <span className={tx.tx_type === "earn" ? "credit" : "debit"}>
        {tx.tx_type === "earn" ? "+" : "-"} ₹{tx.amount}
      </span>
    </div>
  ))}
</div>


    </div>
  );
};

export default Wallet;
