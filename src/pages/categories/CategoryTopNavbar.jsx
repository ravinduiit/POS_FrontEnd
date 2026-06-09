import { NavLink } from "react-router-dom";
import "../../styles/sectionNavbar.css";

function CategoryTopNavbar() {
  return (
    <div className="section-top-navbar">
      <NavLink to="/categories" end className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Category List
      </NavLink>

      <NavLink to="/categories/add" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Add Category
      </NavLink>

      <NavLink to="/categories/brands" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Brand List
      </NavLink>

      <NavLink to="/categories/addBrand" className={({ isActive }) => isActive ? "section-nav-item section-nav-active" : "section-nav-item"}>
        Add Brand
      </NavLink>
    </div>
  );
}

export default CategoryTopNavbar;