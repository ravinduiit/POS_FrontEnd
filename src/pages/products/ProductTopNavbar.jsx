import { NavLink } from "react-router-dom";
import "../../styles/sectionNavbar.css";

function ProductTopNavbar() {
  return (
    <div className="section-top-navbar">
      <NavLink to="/products" end className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Product List
      </NavLink>

      <NavLink to="/products/add" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Add Product
      </NavLink>

      <NavLink to="/products/low-stock" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Low Stock
      </NavLink>

      {/* <NavLink to="/products/search" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Search / Filter
      </NavLink> */}
    </div>
  );
}

export default ProductTopNavbar;