import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/api";


export default function JoinCommitteeModal({ committee, onClose }) {

    const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!committee) return null;

  const handleJoin = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/committees/${committee.id}/join/`, {
        method: "POST",
      });

      // ✅ NAVIGATE TO SUCCESS PAGE
      navigate(`/join-success/${committee.id}`);
    } catch (err) {
      setError(err.error || "Failed to join committee");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>Join {committee.name}</h2>
        <p className="subtitle">Confirm your investment details</p>

        <div className="summary-box">
          {committee.daily_amount && (
            <div className="row">
              <span>Daily Investment</span>
              <strong>₹{committee.daily_amount}</strong>
            </div>
          )}

          {committee.monthly_amount && (
            <div className="row">
              <span>Monthly Investment</span>
              <strong>₹{committee.monthly_amount}</strong>
            </div>
          )}
          <div className="row">
    <span>Yearly Investment</span>
    <strong>₹{committee.yearly_amount}</strong>
  </div>

          <div className="row">
            <span>Duration</span>
            <strong>{committee.duration_months} months</strong>
          </div>

          <div className="row total">
  <span>Total Return</span>
  <strong className="green">
    ₹{committee.expected_total_return}
  </strong>
</div>

        </div>

        <ul className="benefits">
          <li>✅ Guaranteed {committee.roi_percent}% returns</li>
          <li>🏦 Eligible for loan after 6 months</li>
          <li>🔒 100% secure and transparent</li>
        </ul>

          {error && <p style={{ color: "red" }}>{error}</p>}

         <button
          className="confirm-btn"
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Joining..." : "Confirm & Join Committee"}
        </button>
      </div>
    </div>
  );
}
