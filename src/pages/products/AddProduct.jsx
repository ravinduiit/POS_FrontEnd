import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/productService";
import "../../styles/productForm.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category_id: "",
    brand_id: "",
    unit: "",
    costPrice: "",
    sellingPrice: "",
    best_price: "",
    stockQty: "",
    reorderLevel: 5,
    description: "",
    image: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const productPayload = {
        name: formData.name,
        barcode: formData.barcode,
        category_id: Number(formData.category_id),
        brand_id: formData.brand_id ? Number(formData.brand_id) : "",
        unit: formData.unit,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        best_price: Number(formData.best_price),
        stockQty: Number(formData.stockQty),
        reorderLevel: Number(formData.reorderLevel),
        description: formData.description,
        image: formData.image,
      };

      const response = await addProduct(productPayload);

      setSuccessMessage(response.message || "Product added successfully");

      setFormData({
        name: "",
        barcode: "",
        category_id: "",
        brand_id: "",
        unit: "",
        costPrice: "",
        sellingPrice: "",
        best_price: "",
        stockQty: "",
        reorderLevel: 5,
        description: "",
        image: "",
      });

      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add product.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <div className="product-form-card">
        <div className="form-header">
          <h1>Add Product</h1>
          <p>Create a new product for your POS system.</p>
        </div>

        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="form-error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Barcode</label>
              <input
                type="text"
                name="barcode"
                placeholder="Enter barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category ID *</label>
              <input
                type="number"
                name="category_id"
                placeholder="Enter category ID"
                value={formData.category_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Brand ID</label>
              <input
                type="number"
                name="brand_id"
                placeholder="Enter brand ID"
                value={formData.brand_id}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="">Select unit</option>
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="box">box</option>
                <option value="pack">pack</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cost Price *</label>
              <input
                type="number"
                name="costPrice"
                placeholder="Enter cost price"
                value={formData.costPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Selling Price *</label>
              <input
                type="number"
                name="sellingPrice"
                placeholder="Enter selling price"
                value={formData.sellingPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

             <div className="form-group">
              <label>Best Price *</label>
              <input
                type="number"
                name="best_price"
                placeholder="Enter selling price"
                value={formData.best_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stockQty"
                placeholder="Enter stock quantity"
                value={formData.stockQty}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Reorder Level</label>
              <input
                type="number"
                name="reorderLevel"
                placeholder="Enter reorder level"
                value={formData.reorderLevel}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                placeholder="Enter image URL"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;