import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../../services/customerService";

import "../../styles/customerForm.css";

function AddCustomer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    total_due: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        total_due: formData.total_due.trim(),
        email: formData.email.trim(),
      };

      const response = await addCustomer(payload);

      setSuccessMessage(
        response.message || "Customer added successfully"
      );

      setFormData({
        name: "",
        phone: "",
        total_due: "",
        email: "",
      });

      setTimeout(() => {
        navigate("/customers");
      }, 1000);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add customer";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-page">
      <div className="customer-form-card">
        <div className="form-header">
          <h1>Add Customer</h1>
          <p>Create a new customer for your POS system.</p>
        </div>

        {successMessage && (
          <div className="form-success">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="form-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Customer Name *</label>

              <input
                type="text"
                name="name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Initial Debt</label>

              <input
                type="text"
                name="total_due"
                placeholder="Enter Initial Debt (optional)"
                value={formData.total_due}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter Email Address (optional)"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/customers")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;