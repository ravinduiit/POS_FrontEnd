import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSingleProduct,
  updateProduct,
} from "../../services/productService";
import "../../styles/productForm.css";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const product_id = location.state?.product_id;

  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    barcode: "",
    category: "",
    brand: "",
    unit: "",
    costPrice: "",
    sellingPrice: "",
    best_price: "",
    stockQty: "",
    reorderLevel: "",
    description: "",
    image: "",
    lastStockFillingDDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!product_id) {
        setErrorMessage("Product ID is missing.");
        return;
      }

      const data = await getSingleProduct(product_id);
      const product = data.product;

      setFormData({
        product_id: product.product_id || "",
        name: product.name || "",
        barcode: product.barcode || "",

        // supports both old and new field names
        category: product.category || product.category_id || "",
        brand: product.brand || product.brand_id || "",

        unit: product.unit || "",
        costPrice: product.costPrice ?? "",
        sellingPrice: product.sellingPrice ?? "",
        best_price: product.best_price ?? "",
        stockQty: product.stockQty ?? "",
        reorderLevel: product.reorderLevel ?? "",
        description: product.description || "",
        image: product.image || "",
        lastStockFillingDDate: product.lastStockFillingDDate
          ? product.lastStockFillingDDate.split("T")[0]
          : "",
        isActive: product.isActive,
      });
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to load product details.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [product_id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        product_id: Number(formData.product_id),
        name: formData.name,
        barcode: formData.barcode,
        category: formData.category,
        brand: formData.brand,
        unit: formData.unit,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        stockQty: Number(formData.stockQty),
        reorderLevel: Number(formData.reorderLevel),
        best_price: Number(formData.best_price),
        description: formData.description,
        image: formData.image,
        lastStockFillingDDate: formData.lastStockFillingDDate || null,
      };

      const data = await updateProduct(payload);

      setSuccessMessage(data.message || "Product updated successfully.");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update product.";

      setErrorMessage(message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <h2>Loading product details...</h2>;
  }

  return (
    <div className="product-form-page">
      <div className="product-form-card">
        <div className="form-header">
          <h1>Product Details</h1>
          <p>View and update product information.</p>
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product ID</label>
              <input
                type="number"
                name="product_id"
                value={formData.product_id}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                value={formData.isActive ? "Active" : "Inactive"}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
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
                value={formData.barcode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
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
                <option value="piece">piece</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="liter">liter</option>
                <option value="ml">ml</option>
                <option value="box">box</option>
                <option value="packet">packet</option>
                <option value="bottle">bottle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cost Price *</label>
              <input
                type="number"
                name="costPrice"
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
                value={formData.reorderLevel}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Last Stock Filling Date</label>
              <input
                type="date"
                name="lastStockFillingDDate"
                value={formData.lastStockFillingDDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          {formData.image && (
            <div className="form-group">
              <label>Image Preview</label>
              <img
                src={formData.image}
                alt={formData.name}
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/products")}
            >
              Back
            </button>

            <button type="submit" className="submit-btn" disabled={updating}>
              {updating ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductDetails;