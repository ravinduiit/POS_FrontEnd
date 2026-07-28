import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/productService";
import {brandlst, categorylist} from "../../services/categoryBrandServise"
import { useEffect } from "react";

import "../../styles/productForm.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sinhala_name: "",
    barcode: "",
    category_id: "",
    wholesale_price: "",
    brand_id: "",
    unit: "",
    costPrice: "",
    sellingPrice: "",
    best_price: "",
    stockQty: "",
    rate: "",
    reorderLevel: 5,
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');   
        setSuccessMessage(''); 
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  useEffect(() => {
    fetchcategorylist()
    fetchbrandlst()
  }, []);

  const fetchbrandlst = async () => {
    try {
      const data = await brandlst();

      const brands = Array.isArray(data)
        ? data
        : data?.brands || [];

      setBrandList(brands);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch brand");
    }
  };

  const fetchcategorylist = async () => {
    try {
      const data = await categorylist();

      const categories = Array.isArray(data.categories)
        ? data.categories
        : [];
      setCategoryList(categories);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const productPayload = {
        name: formData.name,
        sinhala_name: formData.sinhala_name,
        barcode: formData.barcode,
        category_id: Number(formData.category_id),
        brand_id: formData.brand_id ? Number(formData.brand_id) : "",
        unit: formData.unit,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        wholesale_price: Number(formData.wholesale_price),
        best_price: Number(formData.best_price),
        stockQty: Number(formData.stockQty),
        rate: Number(formData.rate),
        reorderLevel: Number(formData.reorderLevel),
        description: formData.description,
        image: formData.image,
      };

      const response = await addProduct(productPayload);

      setSuccessMessage(response.message || "Product added successfully");

      setFormData({
        name: "",
        sinhala_name: "",
        barcode: "",
        category_id: "",
        brand_id: "",
        unit: "",
        costPrice: "",
        wholesale_price:"",
        sellingPrice: "",
        best_price: "",
        stockQty: "",
        rate: "",
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
              <label>Product Name * (English)</label>
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
              <label>Product Name * (Sinhala)</label>
              <input
                type="text"
                name="sinhala_name"
                placeholder="Enter product name in Sinhala"
                value={formData.sinhala_name}
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
              <label>Category *</label>
              <select
                name="category_id"
                value={formData.category_id || 0}
                onChange={handleChange}
                required
              >
                <option value={0}>Select Category</option>

                {categoryList.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <select
                name="brand_id"
                value={formData.brand_id || 0}
                onChange={handleChange}
              >
                <option value={0}>Select Brand</option>

                {brandList.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="M">M</option>
                <option value="Kg">Kg</option>
                <option value="g">g</option>
                <option value="Liter">Liter</option>
                <option value="Case">Case</option>
                <option value="Packs">Packs</option>
                <option value="Box">Box</option>
                <option value="Bottle">Bottle</option>
                <option value="Pcs">Pcs</option>
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
              <label>wholesale Price *</label>
              <input
                type="number"
                name="wholesale_price"
                placeholder="Enter wholesale price"
                value={formData.wholesale_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Rate </label>
              <input
                type="number"
                name="rate"
                placeholder="Enter Rate"
                value={formData.rate}
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
           

            {/* <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                placeholder="Enter image URL"
                value={formData.image}
                onChange={handleChange}
              />
            </div> */}
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