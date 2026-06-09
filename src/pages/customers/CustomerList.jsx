import { Outlet } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import CustomerTopNavbar from "./CustomerTopNavbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  getCustomerList,
  toggleCustomerStatus,
  filterCustomers,
} from "../../services/customerService";

function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [updatingCustomerId, setUpdatingCustomerId] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
  });

  const setCustomerListFromResponse = (data) => {
    if (Array.isArray(data)) {
      setCustomers(data);
    } else if (Array.isArray(data.customers)) {
      setCustomers(data.customers);
    } else if (Array.isArray(data.data)) {
      setCustomers(data.data);
    } else {
      setCustomers([]);
    }
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await getCustomerList();

      setCustomerListFromResponse(data);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to load customers.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

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

      const payload = {};

      if (filters.name) {
        payload.name = filters.name;
      }

      if (filters.mobile) {
        payload.mobile = filters.mobile;
      }

      if (filters.isActive === "active") {
        payload.isActive = true;
      }

      if (filters.isActive === "inactive") {
        payload.isActive = false;
      }

      const data = await filterCustomers(payload);

      setCustomerListFromResponse(data);

      setSuccessMessage(
        data.message || "Filtered customers fetched successfully."
      );
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to filter customers.";

      setErrorMessage(message);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleRowClick = (customer_id) => {
    navigate("/customers/details", {
      state: {
        customer_id,
      },
    });
  };

  const handleClearFilters = async () => {
    setFilters({
      name: "",
    });

    await loadCustomers();
  };
  
  const handleToggleStatus = async (customer_id) => {
    try {
      setUpdatingCustomerId(customer_id);

      const data = await toggleCustomerStatus(customer_id);

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.customer_id === customer_id
            ? {
                ...customer,
                isActive: data.customer.isActive,
              }
            : customer
        )
      );

      setSuccessMessage(
        data.message || "Customer status updated successfully."
      );
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update customer status.";

      setErrorMessage(message);
    } finally {
      setUpdatingCustomerId(null);
    }
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

  if (loading) {
    return <h2>Loading customers...</h2>;
  }

  return (
    <div>
      <h1>Customer List</h1>

      {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}

      {successMessage && (
        <div style={successBoxStyle}>{successMessage}</div>
      )}

      <form onSubmit={handleApplyFilter} style={filterBoxStyle}>
        <div style={filterGridStyle}>
          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Customer Name</label>

            <input
              type="text"
              name="name"
              placeholder="Search customer name"
              value={filters.name}
              onChange={handleFilterChange}
              style={filterInputStyle}
            />
          </div>

          {/* <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Mobile Number</label>

            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              value={filters.mobile}
              onChange={handleFilterChange}
              style={filterInputStyle}
            />
          </div> */}

          {/* <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Status</label>

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
          </div> */}
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

          <button
            type="button"
            onClick={loadCustomers}
            style={refreshButtonStyle}
          >
            Refresh
          </button>
        </div>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#1f2937", color: "white" }}>
              <th style={tableHeaderStyle}>Customer ID</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Customer Name</th>
              <th style={tableHeaderStyle}>Mobile</th>
              {/* <th style={tableHeaderStyle}>Email</th> */}
              {/* <th style={tableHeaderStyle}>Address</th> */}
              {/* <th style={tableHeaderStyle}>Created Date</th> */}
              <th style={tableHeaderStyle}>Total Due</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr
                  key={customer.customer_id}
                  style={tableRowStyle}
                >
                  <td style={tableCellStyle}>
                    {customer.customer_id}
                  </td>

                  <td style={tableCellStyle}>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(customer.customer_id)
                      }
                      disabled={
                        updatingCustomerId === customer.customer_id
                      }
                      style={
                        customer.isActive
                          ? activeStatusButton
                          : inactiveStatusButton
                      }
                    >
                      {updatingCustomerId === customer.customer_id ? (
                        "Updating..."
                      ) : customer.isActive ? (
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

                  <td style={clickableCellStyle} onClick={() => handleRowClick(customer.customer_id)}>
                    {customer.name || "-"}
                  </td>

                  <td style={tableCellStyle}>
                    {customer.phone || "-"}
                  </td>

                  <td style={tableCellStyle}>
                    {customer.total_due || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tableCellStyle} colSpan="7">
                  No customers found.
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
  gridTemplateColumns: "repeat(3, 1fr)",
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

const tableRowStyle = {
  cursor: "default",
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

export default CustomerList;