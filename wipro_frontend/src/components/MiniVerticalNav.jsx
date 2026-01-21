import { NavLink } from "react-router-dom";
import "../styles/MiniVerticalNav.css";

export default function MiniVerticalNav() {
  return (
    <div className="mini-vertical-nav">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `nav-icon ${isActive ? "active" : ""}`
        }
        title="Market Listings"
      >
        <i className="bi bi-bank"></i>
        <span className="nav-tooltip">Market</span>
      </NavLink>

      <NavLink
        to="/my-properties"
        className={({ isActive }) =>
          `nav-icon ${isActive ? "active" : ""}`
        }
        title="My Properties"
      >
        <i className="bi bi-wallet2"></i>
        <span className="nav-tooltip">My Properties</span>
      </NavLink>

      <NavLink
        to="/my-requests"
        className={({ isActive }) =>
          `nav-icon ${isActive ? "active" : ""}`
        }
        title="My Requests"
      >
        <i className="bi bi-grid"></i>
        <span className="nav-tooltip">Requests</span>
      </NavLink>

      <NavLink
        to="/createproperty"
        className={({ isActive }) =>
          `nav-icon ${isActive ? "active" : ""}`
        }
        title="Add Property"
      >
        <i className="bi bi-plus-lg"></i>
        <span className="nav-tooltip">Add Property</span>
      </NavLink>
    </div>
  );
}
