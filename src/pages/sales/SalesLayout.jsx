import { Outlet } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import SalesTopNavbar from "./SalesTopNavbar";

function SalesLayout() {
  return (
    <MainLayout>
      <SalesTopNavbar />

      <div className="section-content">
        <Outlet />
      </div>
    </MainLayout>
  );
}

export default SalesLayout;