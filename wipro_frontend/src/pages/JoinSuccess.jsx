import { useParams, useNavigate } from "react-router-dom";

export default function JoinSuccess() {
  const { committeeId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#16a34a" }}>🎉 Successfully Joined!</h2>
      <p>You have successfully joined the committee.</p>

      <h3 style={{ marginTop: 30 }}>How do you want to pay?</h3>

      
    </div>
  );
}

const btnStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "#f9fafb",
  fontSize: "16px",
  cursor: "pointer",
};
