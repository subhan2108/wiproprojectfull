import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/wipo-logo.webp";


export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar-pill">
        
        {/* LEFT */}
        <div className="navbar-left">
          <img src={logo} alt="WIPO Group" className="navbar-logo" />

          
        </div>

        {/* CENTER */}
        <ul className="navbar-links">
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/">Properties</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li><NavLink to="/committees">Committees</NavLink></li>
          <li><NavLink to="/wallet">Wallet</NavLink></li>
          <li><NavLink to="/referral">Refer & Earn</NavLink></li>
        </ul>

        {/* RIGHT */}
        <div className="navbar-user">
          <div className="user-avatar">JD</div>
          <i className="bi bi-chevron-down"></i>
        </div>

      </nav>
    </div>
  );
}
