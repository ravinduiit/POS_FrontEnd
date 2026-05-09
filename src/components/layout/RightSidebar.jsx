import {
  FaHome,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaCog,
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getLoggedUserName,
  getLoggedUserRole,
  isUserLoggedIn,
  logoutUser,
} from "../../services/authService";
import "../../styles/sidebar.css";

const navItems = [
  { id: 1, label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { id: 2, label: "Products", icon: <FaBoxOpen />, path: "/products" },
  { id: 3, label: "Categories", icon: <FaTags />, path: "/categories" },
  { id: 4, label: "Sales", icon: <FaShoppingCart />, path: "/sales" },
  { id: 5, label: "Users", icon: <FaUsers />, path: "/users" },
  { id: 6, label: "Settings", icon: <FaCog />, path: "/settings" },
];

function RightSidebar() {
  const navigate = useNavigate();

  const loggedIn = isUserLoggedIn();
  const userName = getLoggedUserName();
  const userRole = getLoggedUserRole();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <aside className="right-sidebar">
      <div>
        <div className="sidebar-title">
          <h3>POS Menu</h3>
        </div>

        <div className={loggedIn ? "user-status logged" : "user-status not-logged"}>
          <FaUserCircle className="user-status-icon" />

          {loggedIn ? (
            <div>
              <h4>{userName}</h4>
              <p>{userRole}</p>
            </div>
          ) : (
            <div>
              <h4>Not Logged In</h4>
              <p>Please login</p>
            </div>
          )}
        </div>

        <div className="sidebar-grid">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-box-link active-link" : "nav-box-link"
              }
            >
              <div className="nav-box">
                <div className="nav-icon">{item.icon}</div>
                <p className="nav-label">{item.label}</p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default RightSidebar;