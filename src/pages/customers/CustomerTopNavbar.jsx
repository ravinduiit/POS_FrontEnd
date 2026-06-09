import { NavLink } from "react-router-dom";
import "../../styles/sectionNavbar.css";

function CustomerTopNavbar() {
  return (
    <div className="section-top-navbar">
      <NavLink to="/customers" end className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Customer List
      </NavLink>

      <NavLink to="/customers/add" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Add Customer
      </NavLink>

    </div>
  );
}

export default CustomerTopNavbar;