import { useEffect, useState } from "react";
import { getCommittees } from "../apiwallet/committee.js";
import CommitteeCard from "../components/CommitteeCard";
export default function CommitteeList() {
  const [committees, setCommittees] = useState([]);

  useEffect(() => {
    getCommittees().then(res => {
      setCommittees(res.results || res || []);
    });
  }, []);

  return (
    <div className="page">
      <h2>Available Committees</h2>

      <div className="grid">
        {committees.map(c => (
          <CommitteeCard key={c.id} committee={c} />
        ))}
      </div>
    </div>
  );
}
