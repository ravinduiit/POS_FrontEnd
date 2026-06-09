import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/sellPage.css";
import { categorylist } from "../../services/categoryBrandServise";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categorylist(); 
      const data = response.categories || [];
      setCategories(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos-workspace" style={{ padding: "20px", height: "auto" }}>
      {/* HEADER TITLE SUMMARY HEADER */}
      <div className="command-bar-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#1e293b" }}>Category List</h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>Manage and view all product catalog classifications.</p>
        </div>
        <div className="summary-info">
          <h2 style={{ margin: 0 }}>Total Categories: {categories.length}</h2>
        </div>
      </div>

      {/* ERROR / LOADING TOAST PLACEMENTS */}
      {error && <div className="toast-message error">{error}</div>}

      {/* MAIN CARDS TABLE VIEW CONTENT */}
      <div className="cart-table-card" style={{ marginTop: "15px" }}>
        <div className="table-wrapper">
          <table className="main-cart-table">
            <thead>
              <tr>
                <th className="w-15">ID</th>
                <th className="w-15">Category Name</th>
                <th className="w-50">Description</th>
                <th className="text-center w-15">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="empty-state">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">No categories found in the system database.</td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  /* FIXED: Added a fallback validation to catch either property safely */
                  <tr key={category._id || category.category_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td className="font-bold">{category.category_id}</td>
                    <td className="font-bold text-primary">{category.name}</td>
                    <td style={{ color: category.description ? "#1e293b" : "#94a3b8", fontStyle: category.description ? "normal" : "italic" }}>
                      {category.description || "No description provided"}
                    </td>
                    <td className="text-center">
                      <span 
                        style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: category.isActive ? "#dcfce7" : "#fee2e2",
                          color: category.isActive ? "#16a34a" : "#dc2626"
                        }}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}