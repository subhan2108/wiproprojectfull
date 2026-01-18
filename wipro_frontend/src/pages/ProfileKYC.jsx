import "../styles/profilekyc.css";

export default function KYC() {
  return (
    <div className="kyc-page">
      <div className="kyc-card">

        <div className="badge-wrap">
          <span className="secure-badge">SECURE VERIFICATION</span>
        </div>

        <h1>
          Complete your <span>KYC</span>
        </h1>
        <p className="sub-text">
          Please provide your details to unlock full account features.
        </p>

        {/* EMAIL */}
        <div className="step-row">
          <div className="step-number">1</div>
          <div className="step-content">
            <p className="step-title">EMAIL AUTHENTICATION</p>
            <div className="input-wrap">
              <input type="email" placeholder="yourname@email.com" />
              <button>SEND OTP</button>
            </div>
          </div>
        </div>

        {/* PHONE */}
        <div className="step-row">
          <div className="step-number">2</div>
          <div className="step-content">
            <p className="step-title">PHONE VERIFICATION</p>
            <div className="input-wrap">
              <input type="text" placeholder="+91 00000 00000" />
              <button>GET OTP</button>
            </div>
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="doc-row">
          <div className="doc-box">
            <p className="doc-title">AADHAR CARD</p>
            <input type="text" placeholder="12 Digit Number" />
            <div className="upload-box">
              <span>☁️</span>
              <p>FRONT SIDE PHOTO</p>
              <input type="file" />
            </div>
          </div>

          <div className="doc-box">
            <p className="doc-title">PAN CARD</p>
            <input type="text" placeholder="PAN NUMBER" />
            <div className="upload-box">
              <span>☁️</span>
              <p>PAN CARD PHOTO</p>
              <input type="file" />
            </div>
          </div>
        </div>

        <button className="submit-btn">
          COMPLETE KYC PROCESS →
        </button>

        <p className="footer-note">
          🔒 End-to-end encrypted verification
        </p>

      </div>
    </div>
  );
}
