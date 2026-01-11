import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCommitteeDetail } from "../apiwallet/committee.js";
import InvestModal from "../components/InvestModal";
import WithdrawModal from "../components/WithdrawModal";

export default function CommitteeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getCommitteeDetail(id).then(setData);
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>{data.name}</h2>

      <p>Total Invested: ₹{data.invested}</p>
      <p>Interest Earned: ₹{data.interest}</p>
      <p>Days Active: {data.days}</p>

      <InvestModal committeeId={id} />
      <WithdrawModal committeeId={id} />
    </div>
  );
}
