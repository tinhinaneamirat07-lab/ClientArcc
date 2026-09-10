import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("fh_sidebar_collapsed") === "true");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { localStorage.setItem("fh_sidebar_collapsed", String(collapsed)); }, [collapsed]);

  return (
    <div className={`dashboard-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="main-wrapper">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            ☰
          </button>
          <button className="desktop-toggle" onClick={() => setCollapsed(v => !v)} aria-label="Toggle sidebar">
            {collapsed ? "☰" : "—"}
          </button>
          <span className="topbar-title">ClientArc</span>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
