import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";
import logo from "../assets/wipo-logo.webp";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar-pill">

          {/* LEFT */}
          <div className="navbar-left">
            <img src={logo} alt="WIPO Group" className="navbar-logo" />
          </div>

          {/* CENTER – DESKTOP */}
          <ul className="navbar-links desktop-only">
            <li><NavLink to="/home">Home</NavLink></li>
            <li><NavLink to="/properties">Properties</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/committees">Committees</NavLink></li>
            <li><NavLink to="/wallet">Wallet</NavLink></li>
            <li><NavLink to="/referral">Refer & Earn</NavLink></li>
          </ul>

          {/* RIGHT – DESKTOP ONLY */}
          {/* RIGHT */}
<div className="navbar-right">
  <div className="navbar-user">
    <div className="user-avatar">JD</div>
    <i className="bi bi-chevron-down"></i>
  </div>

  <button
    className={`hamburger mobile-only ${menuOpen ? "open" : ""}`}
    onClick={() => setMenuOpen(!menuOpen)}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>


         

        </nav>
      </div>

      {/* MOBILE MENU (NO ACCOUNT DROPDOWN ✅) */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <NavLink onClick={() => setMenuOpen(false)} to="/home">Home</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/properties">Properties</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/about">About</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/contact">Contact</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/committees">Committees</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/wallet">Wallet</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/referral">Refer & Earn</NavLink>
      </div>
    </>
  );
}
