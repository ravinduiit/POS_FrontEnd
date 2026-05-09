import { Outlet } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ProductTopNavbar from "./ProductTopNavbar";

function ProductLayout() {
  return (
    <MainLayout>
      <ProductTopNavbar />

      <div className="section-content">
        <Outlet />
      </div>
    </MainLayout>
  );
}

export default ProductLayout;