import { NavLink } from "react-router-dom";
import "../../styles/sectionNavbar.css";

function SalesTopNavbar() {
  return (
    <div className="section-top-navbar">
      <NavLink to="/sales" end className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        New Sale
      </NavLink>

      <NavLink to="/sales/history" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Sales History
      </NavLink>

      <NavLink to="/sales/returns" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Returns
      </NavLink>

      <NavLink to="/sales/reports" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Reports
      </NavLink>
    </div>
  );
}

export default SalesTopNavbar;