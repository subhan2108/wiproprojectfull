import { Link } from "react-router-dom";
import "../styles/navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LEFT: Logo */}
        <div className="navbar-left">
          <img src="/wipo-logo.png" alt="WIPO Group" className="navbar-logo" />
          <span className="navbar-brand">WIPO Group</span>
        </div>

        {/* CENTER: Links */}
        <ul className="navbar-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* RIGHT: Actions */}
        <div className="navbar-actions">
          <i className="bi bi-brightness-high"></i>
          <i className="bi bi-currency-rupee"></i>
          <i className="bi bi-globe"></i>

          <Link to="/login" className="navbar-login">
            Login
          </Link>

          <Link to="/signup" className="navbar-cta">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}
