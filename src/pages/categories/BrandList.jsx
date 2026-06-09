import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/sellPage.css";
import { brandlst } from "../../services/categoryBrandServise"; // Assumes your service has a brand list fetcher

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandlst(); 
      const data = response.brands || []; 
      setBrands(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos-workspace" style={{ padding: "20px", height: "auto" }}>
      {/* HEADER TITLE SUMMARY HEADER */}
      <div className="command-bar-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#1e293b" }}>Brand List</h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>Manage and view all product catalog manufacturer brands.</p>
        </div>
        <div className="summary-info">
          <h2 style={{ margin: 0 }}>Total Brands: {brands.length}</h2>
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
                <th className="w-15">Brand Name</th>
                <th className="w-50">Description</th>
                <th className="text-center w-15">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="empty-state">Loading brands...</td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">No brands found in the system database.</td>
                </tr>
              ) : (
                brands.map((brand, index) => {
                  // Safe conditional boolean check to bypass string conversions or key omissions
                  const isBrandActive = 
                    brand.isActive === true || 
                    brand.isActive === "true" || 
                    brand.isActive === "Active" ||
                    brand.active === true;

                  return (
                    <tr key={brand._id || brand.brand_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                      <td className="font-bold">{brand.brand_id || brand.category_id}</td>
                      <td className="font-bold text-primary">{brand.name}</td>
                      <td style={{ color: brand.description ? "#1e293b" : "#94a3b8", fontStyle: brand.description ? "normal" : "italic" }}>
                        {brand.description || "No description provided"}
                      </td>
                      <td className="text-center">
                        <span 
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor: isBrandActive ? "#dcfce7" : "#fee2e2",
                            color: isBrandActive ? "#16a34a" : "#dc2626"
                          }}
                        >
                          {isBrandActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}