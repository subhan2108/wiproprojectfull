import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import "../styles/profilekyc.css";

export default function KYC() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    aadhar_number: "",
    pan_number: "",
    aadhar_front_photo: null,
    pan_card_photo: null,
  });

  const [status, setStatus] = useState("form"); 
  // form | pending | approved | rejected
  const [loading, setLoading] = useState(false);

  // 🔹 Load existing KYC status
  useEffect(() => {
    apiFetch("/auth/kyc/")
      .then((res) => {
        if (res.exists) {
          setStatus(res.status);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const submitKYC = async () => {
  setLoading(true);

  const data = new FormData();
  Object.keys(form).forEach((key) => {
    if (form[key]) data.append(key, form[key]);
  });

  // 🔥 ADD THIS PART
  const referralCode = localStorage.getItem("referral_code");
  if (referralCode) {
    data.append("referral_code", referralCode);
  }

  try {
    await apiFetch("/auth/kyc/", {
      method: "POST",
      body: data,
    });

    // optional: clear after successful KYC submit
    localStorage.removeItem("referral_code");

    setStatus("pending");
  } catch {
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  // 🟡 Pending UI
  if (status === "pending") {
    return (
      <div className="kyc-card">
        <h2>⏳ Verification in Progress</h2>
        <p>Please wait until the owner verifies your documents.</p>
      </div>
    );
  }

  // 🟢 Approved UI
  if (status === "approved") {
    return (
      <div className="kyc-card success">
        <h2>✅ KYC Verified Successfully</h2>
        <p>Your account is now fully activated.</p>
        <button onClick={() => navigate("/")}>GO TO HOME</button>
      </div>
    );
  }

  // 🔴 Rejected UI
  if (status === "rejected") {
    return (
      <div className="kyc-card error">
        <h2>❌ Verification Failed</h2>
        <p>Sorry, you are not verified. Please contact support.</p>
      </div>
    );
  }

  // 🧾 FORM UI
  return (
    <div className="kyc-page">
      <div className="kyc-card">
        <h1>Complete your <span>KYC</span></h1>

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="yourname@email.com"
          onChange={handleChange}
        />

        {/* PHONE */}
        <input
          name="phone_number"
          placeholder="+91 00000 00000"
          onChange={handleChange}
        />

        {/* AADHAR */}
        <input
          name="aadhar_number"
          placeholder="12 Digit Aadhar Number"
          onChange={handleChange}
        />
        <input
          type="file"
          name="aadhar_front_photo"
          onChange={handleChange}
        />

        {/* PAN */}
        <input
          name="pan_number"
          placeholder="PAN Number"
          onChange={handleChange}
        />
        <input
          type="file"
          name="pan_card_photo"
          onChange={handleChange}
        />

        <button
          className="submit-btn"
          onClick={submitKYC}
          disabled={loading}
        >
          {loading ? "Submitting..." : "COMPLETE KYC PROCESS →"}
        </button>
      </div>
    </div>
  );
}
