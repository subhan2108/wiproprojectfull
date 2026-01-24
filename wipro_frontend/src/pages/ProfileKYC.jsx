import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import "../styles/ProfileKYC.css";

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
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");

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

    // remove error while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setAlert("");
  };


  // ✅ VALIDATION
  const validateForm = () => {
  const newErrors = {};

  /* EMAIL */
  if (!form.email) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Enter a valid email address";
  }

  /* PHONE (INTERNATIONAL FRIENDLY) */
  if (!form.phone_number) {
    newErrors.phone_number = "Phone number is required";
  } else if (!/^\+?[0-9]{7,15}$/.test(form.phone_number)) {
    newErrors.phone_number =
      "Enter a valid international phone number";
  }

  /* AADHAAR (ONLY IF PROVIDED) */
  if (form.aadhar_number && !/^\d{12}$/.test(form.aadhar_number)) {
    newErrors.aadhar_number = "Aadhaar must be 12 digits";
  }

  /* PAN (ONLY IF PROVIDED) */
  if (
    form.pan_number &&
    !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan_number)
  ) {
    newErrors.pan_number = "Invalid PAN format (ABCDE1234F)";
  }

  setErrors(newErrors);
  setAlert(
    Object.keys(newErrors).length
      ? "Please correct the highlighted fields"
      : ""
  );

  return Object.keys(newErrors).length === 0;
};


  const submitKYC = async () => {
    if (!validateForm()) return;

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

      localStorage.removeItem("referral_code");
      setStatus("pending");
    } catch {
      setAlert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // 🔹 STATUS UI (PENDING / APPROVED / REJECTED)
if (["pending", "approved", "rejected"].includes(status)) {
  return (
    <div className="kyc-status-page">
      <div className={`kyc-status-card ${status}`}>

        {/* ICON */}
        <div className="status-icon">
          {status === "pending" && "⏳"}
          {status === "approved" && "✅"}
          {status === "rejected" && "❌"}
        </div>

        {/* TITLE */}
        <h2>
          {status === "pending" && "Verification in Progress"}
          {status === "approved" && "KYC Verified Successfully"}
          {status === "rejected" && "Verification Failed"}
        </h2>

        {/* DESCRIPTION */}
        <p className="status-text">
          {status === "pending" &&
            "Your documents were submitted successfully. Please wait while our team verifies your details."}

          {status === "approved" &&
            "Your account is now fully verified and unlocked for all features."}

          {status === "rejected" &&
            "Unfortunately, your verification was rejected. Please contact support for assistance."}
        </p>

        {/* EXTRA INFO */}
        {status === "pending" && (
          <div className="status-info">
            <div>⏱️ Usually takes 24–48 hours</div>
            <div>🔒 Your data is encrypted & secure</div>
          </div>
        )}

        {/* ACTION BUTTON */}
         {/* ✅ BUTTON ONLY FOR APPROVED */}
        {status === "approved" && (
          <button
            className="status-btn"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        )}

      </div>
    </div>
  );
}


  // 🧾 FORM UI
  return (
    <div className="kyc-page">
  <div className="kyc-card">

    <div className="badge-wrap">
      <span className="secure-badge">SECURE VERIFICATION</span>
    </div>

    <h1>Complete your <span>KYC</span></h1>
    <p className="sub-text">
      Please provide your details to unlock full account features.
    </p>

    {/* GLOBAL ALERT */}
    {alert && <div className="form-alert error">{alert}</div>}

    {/* EMAIL */}
    <div className="step-row">
      <div className="step-number">1</div>
      <div className="step-content">
        <p className="step-title">EMAIL AUTHENTICATION</p>
        <div className="input-wrap">
          <input
            type="email"
            name="email"
            placeholder="yourname@email.com"
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
        </div>
        {errors.email && (
          <small className="error-text">{errors.email}</small>
        )}
      </div>
    </div>

    {/* PHONE */}
    <div className="step-row">
      <div className="step-number">2</div>
      <div className="step-content">
        <p className="step-title">PHONE VERIFICATION</p>
        <div className="input-wrap">
          <input
            type="text"
            name="phone_number"
            placeholder="+91 00000 00000"
            onChange={handleChange}
            className={errors.phone_number ? "input-error" : ""}
          />
        </div>
        {errors.phone_number && (
          <small className="error-text">{errors.phone_number}</small>
        )}
        <small className="helper-text">
          International numbers supported (e.g. +14155552671)
        </small>
      </div>
    </div>

    {/* DOCUMENTS */}
    <div className="doc-row">

      {/* AADHAAR */}
      <div className="doc-box">
        <p className="doc-title">AADHAR CARD</p>
        <input
          type="text"
          name="aadhar_number"
          placeholder="12 Digit Number"
          onChange={handleChange}
          className={errors.aadhar_number ? "input-error" : ""}
        />
        {errors.aadhar_number && (
          <small className="error-text">{errors.aadhar_number}</small>
        )}
        <small className="helper-text">
          Indian users only (optional for foreign users)
        </small>

        <div className="upload-box">
          <span>☁️</span>
          <p>FRONT SIDE PHOTO</p>
          <input
            type="file"
            name="aadhar_front_photo"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* PAN */}
      <div className="doc-box">
        <p className="doc-title">PAN CARD</p>
        <input
          type="text"
          name="pan_number"
          placeholder="PAN NUMBER"
          onChange={handleChange}
          className={errors.pan_number ? "input-error" : ""}
        />
        {errors.pan_number && (
          <small className="error-text">{errors.pan_number}</small>
        )}
        <small className="helper-text">
          Format: ABCDE1234F (optional for non-Indian users)
        </small>

        <div className="upload-box">
          <span>☁️</span>
          <p>PAN CARD PHOTO</p>
          <input
            type="file"
            name="pan_card_photo"
            onChange={handleChange}
          />
        </div>
      </div>

    </div>

    <button
      className="submit"
      onClick={submitKYC}
      disabled={loading}
    >
      {loading ? "Submitting..." : "COMPLETE KYC PROCESS"}
    </button>

    <p className="footer-note">
      🔒 End-to-end encrypted verification
    </p>

  </div>
</div>

  );
}