import { NavLink } from "react-router-dom";
import "../../styles/sectionNavbar.css";

function UserTopNavbar() {
  return (
    <div className="section-top-navbar">
      <NavLink to="/users" end className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        User List
      </NavLink>

      <NavLink to="/users/add" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Add User
      </NavLink>

      <NavLink to="/users/roles" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        User Roles
      </NavLink>

      <NavLink to="/users/search" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Search Users
      </NavLink>
    </div>
  );
}

export default UserTopNavbar;