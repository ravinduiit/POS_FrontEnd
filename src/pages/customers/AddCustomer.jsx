import { Outlet } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import CustomerTopNavbar from "./CustomerTopNavbar";

function AddCustomer() {
  return (
    <MainLayout>

      <div className="section-content">
        <Outlet />
      </div>
    </MainLayout>
  );
}

export default AddCustomer;