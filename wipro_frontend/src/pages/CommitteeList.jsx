import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import JoinCommitteeModal from "../components/JoinCommitteeModal";
import '../styles/committee.css'

export default function CommitteeList() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  useEffect(() => {
    apiFetch("/committees/")
      .then((data) => {
        setCommittees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading committees...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Committees</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {committees.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              background: "#fff",
            }}
          >
            <h3>{c.name}</h3>

            {c.daily_amount && (
              <p>
                <b>Daily Investment:</b> ₹{c.daily_amount}
              </p>
            )}

            {c.monthly_amount && (
              <p>
                <b>Monthly Investment:</b> ₹{c.monthly_amount}
              </p>
            )}

            {c.yearly_amount && (
              <p>
                <b>Yearly Investment:</b> ₹{c.yearly_amount}
              </p>
            )}

            <p>
              <b>Duration:</b> {c.duration_months} months
            </p>
            <p>
              <b>ROI:</b> {c.roi_percent}%
            </p>
            <p>
              <b>Slots:</b> {c.filled_slots} / {c.total_slots}
            </p>

            <button
              disabled={c.slots_available <= 0}
              onClick={() => setSelectedCommittee(c)}   // ✅ OPEN MODAL
              style={{
                marginTop: "10px",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "6px",
                background: c.slots_available > 0 ? "#16a34a" : "#999",
                color: "#fff",
                cursor: c.slots_available > 0 ? "pointer" : "not-allowed",
              }}
            >
              {c.slots_available > 0 ? "Join Committee" : "Slots Full"}
            </button>
          </div>
        ))}
      </div>

      {/* ✅ JOIN COMMITTEE MODAL */}
      {selectedCommittee && (
        <JoinCommitteeModal
          committee={selectedCommittee}
          onClose={() => setSelectedCommittee(null)}
        />
      )}
    </div>
  );
}
