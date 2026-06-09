import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addBrand } from "../../services/categoryBrandServise";
import "../../styles/productForm.css";

function AddBrand() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!formData.name.trim()) {
        setErrorMessage("Brand name is required");
        return;
      }

      const data = await addBrand({
        name: formData.name,
        description: formData.description,
      });

      setSuccessMessage(data.message || "Brand added successfully");

      setFormData({
        name: "",
        description: "",
      });

      setTimeout(() => {
        navigate("/categories/brands");
      }, 1500);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "Failed to add brand"
      );
    } finally {
      setLoading(false);
    }
  };

  // auto hide messages (2.5s)
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="product-form-page">
      <div className="product-form-card">

        <div className="form-header">
          <h1>Add Brand</h1>
          <p>Create a new product brand</p>
        </div>

        {errorMessage && (
          <div className="form-error">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* BRAND NAME */}
          <div className="form-group">
            <label>Brand Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter brand name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter brand description (optional)"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/brands")}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Add Brand"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddBrand;