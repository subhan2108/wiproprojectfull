import "../styles/main.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Stat({ value, suffix = "", label, duration = 5000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div className="stat-item">
      <h3>
        {count}
        {suffix}
      </h3>
      <p>{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      {/* HERO SECTION */}
<section className="hero">
  <div className="hero-content">

    <span className="hero-pill">
      Trusted by 10,000+ Investors
    </span>

    <h1 className="hero-title">
      Buy, Sell & Invest Smarter <br />
      with <span>WIPO Group</span>
    </h1>

    <p className="hero-subtitle">
      Your trusted partner in real estate and investment.
      Secure, transparent, and profitable opportunities await.
    </p>

    <div className="hero-actions">
      <Link to="/" className="hero-btn primary">
        <i className="bi bi-building btn-icon"></i> Buy Property
      </Link>

      <Link to="/committees"className="hero-btn secondary">
        <i className="bi bi-graph-up-arrow btn-icon"></i> Join Committee
      </Link>
    </div>

  </div>
</section>


      {/* FEATURES */}
      <section className="services-section">
  <div className="services-container">

    <h2 className="services-title">Our Services</h2>
    <p className="services-subtitle">
      Comprehensive solutions for all your property and investment needs
    </p>

    <div className="services-grid">

      <div className="service-card">
        <div className="service-icon">
          <i className="bi bi-house"></i>
        </div>
        <h3>Property Buy</h3>
        <p>
          Browse and purchase verified properties with complete transparency
        </p>
      </div>

      <div className="service-card">
        <div className="service-icon">
          <i className="bi bi-buildings"></i>
        </div>
        <h3>Property Sell</h3>
        <p>
          List your property and reach thousands of potential buyers
        </p>
      </div>

      <div className="service-card">
        <div className="service-icon">
          <i className="bi bi-graph-up-arrow"></i>
        </div>
        <h3>Committee Investment</h3>
        <p>
          Join investment committees with guaranteed returns
        </p>
      </div>

      <div className="service-card">
        <div className="service-icon">
          <i className="bi bi-currency-dollar"></i>
        </div>
        <h3>Loan Assistance</h3>
        <p>
          Get loans based on your committee investments
        </p>
      </div>

    </div>
  </div>
</section>


<section className="how-it-works">
  <div className="how-container">

    <h2 className="how-title">How It Works</h2>
    <p className="how-subtitle">
      Start your investment journey in just a few simple steps
    </p>

    <div className="how-steps">

      <div className="how-step">
        <div className="step-circle">1</div>
        <h3>Create Account</h3>
        <p>
          Sign up and complete your KYC verification to get started
        </p>
      </div>

      <div className="how-step">
        <div className="step-circle">2</div>
        <h3>Choose Investment</h3>
        <p>
          Browse properties or join committee investments that match your goals
        </p>
      </div>

      <div className="how-step">
        <div className="step-circle">3</div>
        <h3>Start Earning</h3>
        <p>
          Track your investments and watch your wealth grow
        </p>
      </div>

    </div>
  </div>
</section>



<section className="stats-section">
      <div className="stats-container">

        <Stat value={10000} suffix="+" label="Active Investors" />
        <Stat value={500} suffix="Cr+" label="Properties Listed" />
        <Stat value={98} suffix="%" label="Customer Satisfaction" />
        <Stat value={15} suffix="+" label="Years Experience" />

      </div>
    </section>


    <section className="why-choose">
  <div className="why-container">

    <h2 className="why-title">Why Choose WIPO Group</h2>
    <p className="why-subtitle">
      We provide secure, transparent, and profitable investment opportunities
    </p>

    <div className="why-grid">

      <div className="why-card">
        <div className="why-icon">
          <i className="bi bi-shield-check"></i>
        </div>
        <h3>100% Secure</h3>
        <p>
          Your investments are protected with bank-grade security and insurance
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="bi bi-bar-chart-line"></i>
        </div>
        <h3>Transparent</h3>
        <p>
          Complete visibility into all transactions and property details
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="bi bi-patch-check"></i>
        </div>
        <h3>Trusted</h3>
        <p>
          15+ years of excellence with thousands of satisfied investors
        </p>
      </div>

    </div>
  </div>
</section>


      {/* CTA */}
      <section className="cta-section">
  <div className="cta-box">
    <h2>Ready to Start Your Investment Journey?</h2>

    <p>
      Join thousands of successful investors who trust WIPO Group for their
      property and investment needs
    </p>

    <div className="cta-actions">
      <a href="/signup" className="cta-btn primary">
        Create Free Account
        <i className="bi bi-arrow-right"></i>
      </a>

      <a href="/contact" className="cta-btn secondary">
        Contact Us
      </a>
    </div>
  </div>
</section>


    </div>
  );
}
