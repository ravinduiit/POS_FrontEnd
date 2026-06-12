import RightSidebar from "./RightSidebar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          padding: "20px",
          marginRight: "280px",
          boxSizing: "border-box",
          background: "#f3f4f6",
        }}
      >
        {children}
      </div>

      <RightSidebar />
    </div>
  );
}

export default MainLayout;