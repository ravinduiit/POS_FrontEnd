import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  getProductList,
  filterProducts,
  toggleProductStatus,
  updateProductStock,
} from "../../services/productService";

function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState(null);

  const [editedStocks, setEditedStocks] = useState({});
  const [stockUpdatingId, setStockUpdatingId] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    brand: "",
    stockStatus: "",
    isActive: "",
  });

  const setProductListFromResponse = (data) => {
    if (Array.isArray(data)) {
      setProducts(data);
    } else if (Array.isArray(data.products)) {
      setProducts(data.products);
    } else if (Array.isArray(data.data)) {
      setProducts(data.data);
    } else {
      setProducts([]);
    }

    setEditedStocks({});
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await getProductList();
      setProductListFromResponse(data);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to load products.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleApplyFilter = async (e) => {
    e.preventDefault();

    try {
      setFilterLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const filterPayload = {};

      if (filters.name.trim()) {
        filterPayload.name = filters.name.trim();
      }

      if (filters.category.trim()) {
        filterPayload.category = filters.category.trim();
      }

      if (filters.brand.trim()) {
        filterPayload.brand = filters.brand.trim();
      }

      if (filters.stockStatus) {
        filterPayload.stockStatus = filters.stockStatus;
      }

      if (filters.isActive === "active") {
        filterPayload.isActive = true;
      }

      if (filters.isActive === "inactive") {
        filterPayload.isActive = false;
      }

      const data = await filterProducts(filterPayload);
      setProductListFromResponse(data);

      setSuccessMessage(
        data.message || "Filtered products fetched successfully."
      );
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to filter products.";

      setErrorMessage(message);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      name: "",
      category: "",
      brand: "",
      stockStatus: "",
      isActive: "",
    });

    await loadProducts();
  };

  const handleRowClick = (product_id) => {
    navigate("/products/details", {
      state: {
        product_id,
      },
    });
  };

  const handleToggleStatus = async (e, product_id) => {
    e.stopPropagation();

    try {
      setErrorMessage("");
      setSuccessMessage("");
      setUpdatingProductId(product_id);

      const data = await toggleProductStatus(product_id);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.product_id === product_id
            ? {
                ...product,
                isActive: data.product.isActive,
              }
            : product
        )
      );

      setSuccessMessage(data.message || "Product status updated successfully.");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update product status.";

      setErrorMessage(message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleStockChange = (product_id, value) => {
    if (value === "" || Number(value) >= 0) {
      setEditedStocks((prev) => ({
        ...prev,
        [product_id]: value,
      }));
    }

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleUpdateStock = async (e, product) => {
    e.stopPropagation();

    const editedStockValue = editedStocks[product.product_id];

    if (
      editedStockValue === undefined ||
      editedStockValue === "" ||
      Number(editedStockValue) === Number(product.stockQty)
    ) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");
      setStockUpdatingId(product.product_id);

      const data = await updateProductStock({
        product_id: product.product_id,
        stockQty: Number(editedStockValue),
        lastStockFillingDate: new Date().toISOString(),
      });

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.product_id === product.product_id
            ? {
                ...item,
                stockQty: data.product.stockQty,
                lastStockFillingDate: data.product.lastStockFillingDate,
              }
            : item
        )
      );

      setEditedStocks((prev) => {
        const updated = { ...prev };
        delete updated[product.product_id];
        return updated;
      });

      setSuccessMessage(data.message || "Product stock updated successfully.");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update product stock.";

      setErrorMessage(message);
    } finally {
      setStockUpdatingId(null);
    }
  };

  const isStockChanged = (product) => {
    return (
      editedStocks[product.product_id] !== undefined &&
      editedStocks[product.product_id] !== "" &&
      Number(editedStocks[product.product_id]) !== Number(product.stockQty)
    );
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  return (
    <div>
      <h1>Product List</h1>

      {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}

      {successMessage && <div style={successBoxStyle}>{successMessage}</div>}

      <form onSubmit={handleApplyFilter} style={filterBoxStyle}>
        <div style={filterGridStyle}>
          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Search product name"
              value={filters.name}
              onChange={handleFilterChange}
              style={filterInputStyle}
            />
          </div>

          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Category</label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={filters.category}
              onChange={handleFilterChange}
              style={filterInputStyle}
            />
          </div>

          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="Enter brand"
              value={filters.brand}
              onChange={handleFilterChange}
              style={filterInputStyle}
            />
          </div>

          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Stock Status</label>
            <select
              name="stockStatus"
              value={filters.stockStatus}
              onChange={handleFilterChange}
              style={filterInputStyle}
            >
              <option value="">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
            </select>
          </div>

          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Active Status</label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              style={filterInputStyle}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div style={filterButtonRowStyle}>
          <button
            type="submit"
            style={filterButtonStyle}
            disabled={filterLoading}
          >
            {filterLoading ? "Filtering..." : "Apply Filter"}
          </button>

          <button
            type="button"
            onClick={handleClearFilters}
            style={clearButtonStyle}
          >
            Clear Filter
          </button>

          <button type="button" onClick={loadProducts} style={refreshButtonStyle}>
            Refresh
          </button>
        </div>
      </form>

      <p style={hintStyle}>Click a product name to view full details.</p>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#1f2937", color: "white" }}>
              <th style={tableHeaderStyle}>Product ID</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Barcode</th>
              <th style={tableHeaderStyle}>Category</th>
              <th style={tableHeaderStyle}>Best Price</th>
              <th style={tableHeaderStyle}>Price</th>
              <th style={tableHeaderStyle}>Stock</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id || product.product_id}
                  style={tableRowStyle}
                >
                  <td style={tableCellStyle}>{product.product_id}</td>

                  <td style={tableCellStyle}>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleToggleStatus(e, product.product_id)
                      }
                      disabled={updatingProductId === product.product_id}
                      style={
                        product.isActive
                          ? activeStatusButton
                          : inactiveStatusButton
                      }
                    >
                      {updatingProductId === product.product_id ? (
                        "Updating..."
                      ) : product.isActive ? (
                        <>
                          <FaCheckCircle />
                          Active
                        </>
                      ) : (
                        <>
                          <FaTimesCircle />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>

                  <td
                    style={clickableCellStyle}
                    onClick={() => handleRowClick(product.product_id)}
                  >
                    {product.name}
                  </td>

                  <td style={tableCellStyle}>{product.barcode || "-"}</td>

                  <td style={tableCellStyle}>
                    {product.category || product.category_id || "-"}
                  </td>

                  <td style={tableCellStyle}>
                    {product.best_price ? `Rs. ${product.best_price}` : "-"}
                  </td>

                  <td style={tableCellStyle}>Rs. {product.sellingPrice}</td>

                  <td style={tableCellStyle} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="number"
                      min="0"
                      value={
                        editedStocks[product.product_id] !== undefined
                          ? editedStocks[product.product_id]
                          : product.stockQty
                      }
                      onChange={(e) =>
                        handleStockChange(product.product_id, e.target.value)
                      }
                      style={
                        isStockChanged(product)
                          ? changedStockInputStyle
                          : stockInputStyle
                      }
                    />
                  </td>

                  <td style={tableCellStyle} onClick={(e) => e.stopPropagation()}>
                    {isStockChanged(product) && (
                      <button
                        type="button"
                        onClick={(e) => handleUpdateStock(e, product)}
                        disabled={stockUpdatingId === product.product_id}
                        style={
                          stockUpdatingId === product.product_id
                            ? updatingStockButtonStyle
                            : updateStockButtonStyle
                        }
                      >
                        {stockUpdatingId === product.product_id
                          ? "Updating..."
                          : "Update Stock"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tableCellStyle} colSpan="9">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const filterBoxStyle = {
  background: "white",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.07)",
  marginBottom: "16px",
};

const filterGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "12px",
  marginBottom: "14px",
};

const filterGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const filterLabelStyle = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#374151",
  marginBottom: "6px",
};

const filterInputStyle = {
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  outline: "none",
};

const filterButtonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const filterButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const clearButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#6b7280",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const refreshButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#059669",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "12px",
  overflow: "hidden",
};

const tableHeaderStyle = {
  padding: "12px",
  textAlign: "left",
  fontSize: "14px",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};

const clickableCellStyle = {
  ...tableCellStyle,
  color: "#2563eb",
  fontWeight: "700",
  cursor: "pointer",
};

const tableRowStyle = {
  cursor: "default",
};

const hintStyle = {
  color: "#6b7280",
  fontSize: "14px",
  marginBottom: "12px",
};

const errorBoxStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "16px",
  fontWeight: "600",
};

const successBoxStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "16px",
  fontWeight: "600",
};

const baseStatusButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "6px 12px",
  borderRadius: "999px",
  fontWeight: "700",
  fontSize: "12px",
  cursor: "pointer",
  border: "none",
  minWidth: "95px",
};

const activeStatusButton = {
  ...baseStatusButton,
  background: "#dcfce7",
  color: "#166534",
};

const inactiveStatusButton = {
  ...baseStatusButton,
  background: "#fee2e2",
  color: "#991b1b",
};

const stockInputStyle = {
  width: "90px",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
};

const changedStockInputStyle = {
  ...stockInputStyle,
  border: "2px solid #f59e0b",
  background: "#fffbeb",
  fontWeight: "700",
};

const updateStockButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#f59e0b",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const updatingStockButtonStyle = {
  ...updateStockButtonStyle,
  background: "#9ca3af",
  cursor: "not-allowed",
};

export default ProductList;