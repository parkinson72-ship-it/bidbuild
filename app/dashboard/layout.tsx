import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "40px",
          fontFamily: "sans-serif",
          background: "#f7f7f7",
        }}
      >
        {children}
      </main>
    </div>
  );
}
