import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getSingleCustomer,
  getSaleById,
} from "../../services/customerService";

import "../../styles/productForm.css"; // reuse same UI style

function CustomerDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const customer_id = location.state?.customer_id;

  const [formData, setFormData] = useState({
    customer_id: "",
    name: "",
    phone: "",
    email: "",
    total_due: 0,
    isActive: true,
    debt_list: [],
  });

  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleLoading, setSaleLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadCustomer = async () => {
    try {
      setLoading(true);

      if (!customer_id) {
        setErrorMessage("Customer ID is missing.");
        return;
      }

      const data = await getSingleCustomer(customer_id);
      const customer = data.customer;

      setFormData({
        customer_id: customer.customer_id || "",
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        total_due: customer.total_due || 0,
        isActive: customer.isActive,
        debt_list: customer.debt_list || [],
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "Failed to load customer."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [customer_id]);

  const handleSaleClick = async (sale_id) => {
    try {
      setSaleLoading(true);
      setSelectedSale(null);

      const response = await getSaleById(sale_id);

      console.log("SALE RESPONSE:", response);

      setSelectedSale(response.data); // ✅ correct
    } catch (error) {
      setErrorMessage("Failed to load sale details.");
    } finally {
      setSaleLoading(false);
    }
  };

  if (loading) return <h2>Loading customer details...</h2>;

  return (
    <div className="product-form-page">
      <div className="product-form-card">

        <div className="form-header">
          <h1>Customer Details</h1>
          <p>View customer profile and debt history</p>
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}
        {successMessage && <div className="form-success">{successMessage}</div>}

        {/* BASIC INFO */}
        <div className="form-grid">
          <div className="form-group">
            <label>Customer ID</label>
            <input value={formData.customer_id} disabled />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input value={formData.name} disabled />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input value={formData.phone} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={formData.email} disabled />
          </div>

          <div className="form-group">
            <label>Total Due</label>
            <input value={formData.total_due} disabled />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input value={formData.isActive ? "Active" : "Inactive"} disabled />
          </div>
        </div>

        {/* 💳 DEBT LIST */}
        <div className="form-group full-width">
          <h3 style={{ marginTop: "20px" }}>Debt History</h3>

          {formData.debt_list.length === 0 ? (
            <p>No debt records found.</p>
          ) : (
            <div className="debt-container">
              {formData.debt_list.map((debt, index) => (
                <div
                  key={index}
                  className="debt-card"
                  onClick={() => handleSaleClick(debt.sale_id)}
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: "12px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    background: "#f9fafb",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>
                      Sale ID: <span style={{ color: "#2563eb" }}>{debt.sale_id}</span>
                    </strong>
                    <span style={{ color: "#dc2626" }}>
                      Due: {debt.dueAmount}
                    </span>
                  </div>

                  <small style={{ color: "#6b7280" }}>
                    Click to view sale details
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🧾 SALE DETAILS */}
        {saleLoading && <p>Loading sale details...</p>}

        {selectedSale && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <h3>Sale Details (ID: {selectedSale.selling_id})</h3>

            <p><b>Date:</b> {selectedSale.createdAt}</p>
            <p><b>Total:</b> {selectedSale.grandTotal}</p>
            <p><b>Paid:</b> {selectedSale.paidAmount}</p>
            <p><b>Balance:</b> {selectedSale.balance}</p>

            <hr />

            <h4>Items</h4>
            {selectedSale.items?.map((item, i) => (
              <div key={i} style={{ padding: "5px 0" }}>
                {item.name} - {item.qty} × {item.price}
              </div>
            ))}
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="form-actions">
          <button
            className="cancel-btn"
            onClick={() => navigate("/customers")}
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default CustomerDetails;