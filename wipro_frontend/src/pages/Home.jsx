import "../styles/main.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Buy, Sell & Invest Smarter</h1>
          <p>
            A premium real estate and investment platform designed to grow your wealth.
          </p>

          <div className="home-hero-actions">
            <Link to="/properties" className="btn-primary">
              Explore Properties
            </Link>
            <Link to="/committee" className="btn-secondary">
              Join Committee
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-section">
        <div className="home-container">
          <h2 className="section-title">Why Choose Us</h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Verified Properties</h3>
              <p>Every property is verified to ensure safe and secure investments.</p>
            </div>

            <div className="feature-card">
              <h3>Committee Investments</h3>
              <p>Smart monthly, yearly & flexible committee investment plans.</p>
            </div>

            <div className="feature-card">
              <h3>Secure Wallet</h3>
              <p>Track your balance, transactions, and earnings in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-container">
          <h2>Start Your Investment Journey Today</h2>
          <p>Join thousands of users investing confidently with us.</p>
          <Link to="/signup" className="btn-primary large">
            Get Started
          </Link>
        </div>
      </section>

    </div>
  );
}
