import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

import ProductLayout from "./pages/products/ProductLayout";
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import LowStockProducts from "./pages/products/LowStockProducts";
import ProductDetails from "./pages/products/ProductDetails";

import CategoryLayout from "./pages/categories/CategoryLayout";
import CategoryList from "./pages/categories/CategoryList";
import AddCategory from "./pages/categories/AddCategory";
// import ActiveCategories from "./pages/categories/ActiveCategories";
// import SearchCategories from "./pages/categories/SearchCategories";

import SalesLayout from "./pages/sales/SalesLayout";
import SellPage from "./pages/sales/SellPage";
import SalesHistory from "./pages/sales/SalesHistory";
// import SalesReturns from "./pages/sales/SalesReturns";
// import SalesReports from "./pages/sales/SalesReports";

import UserLayout from "./pages/users/UserLayout";
import UserList from "./pages/users/UserList";
import AddUser from "./pages/users/AddUser";
// import UserRoles from "./pages/users/UserRoles";
// import SearchUsers from "./pages/users/SearchUsers";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<ProductLayout />}>
        <Route index element={<ProductList />} />
        <Route path="details" element={<ProductDetails />} />
        <Route path="add" element={<AddProduct />} />
        <Route path="low-stock" element={<LowStockProducts />} />
        {/* <Route path="search" element={<SearchProducts />} /> */}
      </Route>

      <Route path="/categories" element={<CategoryLayout />}>
        <Route index element={<CategoryList />} />
        <Route path="add" element={<AddCategory />} />
        {/* <Route path="active" element={<ActiveCategories />} />
        <Route path="search" element={<SearchCategories />} /> */}
      </Route>

      <Route path="/sales" element={<SalesLayout />}>
        <Route index element={<SellPage />} />
        <Route path="history" element={<SalesHistory />} />
        {/* <Route path="returns" element={<SalesReturns />} />
        <Route path="reports" element={<SalesReports />} /> */}
      </Route>

      <Route path="/users" element={<UserLayout />}>
        <Route index element={<UserList />} />
        <Route path="add" element={<AddUser />} />
        {/* <Route path="roles" element={<UserRoles />} />
        <Route path="search" element={<SearchUsers />} /> */}
      </Route>

      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;