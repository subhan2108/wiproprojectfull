import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function GroupPaymentInvitesPage() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/group-invites/")
      .then(setInvites)
      .finally(() => setLoading(false));
  }, []);

  const respond = async (inviteId, action) => {
    try {
      await apiFetch(`/group-invites/${inviteId}/respond/`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });

      setInvites(invites.map(inv =>
        inv.id === inviteId ? { ...inv, status: action } : inv
      ));
    } catch (err) {
      alert(err.error || "Action failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Group Payment Requests</h2>

      {invites.length === 0 && <p>No pending invites</p>}

      {invites.map(invite => (
        <div key={invite.id} className="card">
          <h4>{invite.property.title}</h4>
          <p>Amount to pay: ₹{invite.amount}</p>
          <p>Status: {invite.status}</p>

          {invite.status === "invited" && (
            <>
              <button onClick={() => respond(invite.id, "accepted")}>
                Accept
              </button>
              <button onClick={() => respond(invite.id, "rejected")}>
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
