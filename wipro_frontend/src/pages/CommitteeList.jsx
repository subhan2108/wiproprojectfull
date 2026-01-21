import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import JoinCommitteeModal from "../components/JoinCommitteeModal";
import "../styles/committee.css";

export default function CommitteeList() {
  const [committees, setCommittees] = useState([]);
  const [joinedCommitteeMap, setJoinedCommitteeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      apiFetch("/committees/"),
      apiFetch("/my-committees/"),
    ])
      .then(([committeesData, myCommitteesData]) => {
        setCommittees(committeesData);

        // map committee_id -> user_committee_id
        const map = {};
        myCommitteesData.committees.forEach((uc) => {
          map[uc.committee_id] = uc.id;
        });

        setJoinedCommitteeMap(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Loading committees...</div>;
  }

  return (
    <div className="committee-page">
      <h2 className="page-title">Available Committees</h2>

      <div className="committee-grid">
        {committees.map((c) => {
          const slotsLeft = c.total_slots - c.filled_slots;
          const progress = (c.filled_slots / c.total_slots) * 100;

          const isJoined = Boolean(joinedCommitteeMap[c.id]);
          const userCommitteeId = joinedCommitteeMap[c.id];

          return (
            <div className="committee-card" key={c.id}>
              
              {/* 🔴 LAST SLOTS WARNING */}
              {slotsLeft > 0 && slotsLeft <= 2 && (
                <span className="slots-warning">
                  Only {slotsLeft} slots left
                </span>
              )}

              {/* TITLE */}
              <h3 className="committee-title">
                <i className="bi bi-graph-up committee-icon"></i> {c.name}
              </h3>
              <p className="subtitle">High-yield investment committee</p>

              {/* INVESTMENT ROW */}
              <div className="investment-row">
                {c.daily_amount && (
                  <div>
                    <span>Daily Investment</span>
                    <strong>
                      ₹{Number(c.daily_amount).toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
                {c.monthly_amount && (
                  <div>
                    <span>Monthly Investment</span>
                    <strong>
                      ₹{Number(c.monthly_amount).toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
              </div>

              {/* INFO ROW */}
              <div className="info-row">
                <div>
                  <i className="bi bi-hourglass-split"></i>{" "}
                  {c.duration_months} months
                </div>
                <div>
                  <i className="bi bi-graph-up-arrow"></i>{" "}
                  {c.roi_percent}% ROI
                </div>
                <div>
                  <i className="bi bi-people"></i> {c.filled_slots}
                </div>
              </div>

              {/* TOTAL RETURN */}
              <div className="return-box">
                <p>Total Return After {c.duration_months} Months</p>
                <h4>
                  ₹{Number(c.expected_total_return).toLocaleString("en-IN")}
                </h4>
              </div>

              {/* SLOTS */}
              <div className="slots">
                <div className="slots-text">
                  Slots Available
                  <span>
                    {c.filled_slots}/{c.total_slots}
                  </span>
                </div>

                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                className="join-btn"
                disabled={slotsLeft === 0 && !isJoined}
                onClick={() => {
                  if (isJoined) {
                    navigate(`/my-committee/${userCommitteeId}`);
                  } else {
                    setSelectedCommittee(c);
                  }
                }}
              >
                {isJoined
                  ? "View Details →"
                  : slotsLeft === 0
                  ? "Slots Full"
                  : "Join Committee →"}
              </button>
            </div>
          );
        })}
      </div>

      {/* JOIN MODAL */}
      {selectedCommittee && (
        <JoinCommitteeModal
          committee={selectedCommittee}
          onClose={() => setSelectedCommittee(null)}
        />
      )}
    </div>
  );
}
