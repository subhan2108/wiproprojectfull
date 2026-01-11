import { useEffect, useState } from "react";
import { apiFetch } from "../apiwallet/api.js";
import MyCommitteeCard from "../components/MyCommitteeCard";

export default function MyCommittees() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/committees/my/")
      .then(setCommittees)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading communities...</p>;

  if (committees.length === 0) {
    return <p>You haven’t joined any community yet.</p>;
  }

  return (
    <div className="page">
      <h2>My Communities</h2>

      <div className="grid">
        {committees.map(c => (
          <MyCommitteeCard key={c.id} committee={c} />
        ))}
      </div>
    </div>
  );
}
