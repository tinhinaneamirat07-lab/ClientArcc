import { NavLink, useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

type Props = { collapsed: boolean; onToggle?: () => void; mobileOpen: boolean; onCloseMobile: () => void };

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }: Props) {
  const { t } = useSettings();
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-top">
          <h2 className="logo">{collapsed ? "CA" : "ClientArc"}</h2>
        </div>

        <nav>
          <NavLink to="/" onClick={onCloseMobile}><span className="nav-icon">🏠</span><span className="nav-label">{t("dashboard")}</span></NavLink>
          <NavLink to="/clients" onClick={onCloseMobile}><span className="nav-icon">👥</span><span className="nav-label">{t("clients")}</span></NavLink>
          <NavLink to="/projects" onClick={onCloseMobile}><span className="nav-icon">📁</span><span className="nav-label">{t("projects")}</span></NavLink>
          <NavLink to="/tasks" onClick={onCloseMobile}><span className="nav-icon">✅</span><span className="nav-label">{t("tasks")}</span></NavLink>
          <NavLink to="/settings" onClick={onCloseMobile}><span className="nav-icon">⚙️</span><span className="nav-label">{t("settings")}</span></NavLink>
        </nav>

        <div className="sidebar-footer">
          <span className="nav-label" style={{display:"block", marginBottom:8}}>{user?.email}</span>
          <button className="btn-secondary" style={{width:"100%", fontSize:12, padding:"6px"}} onClick={async()=>{ await signOut(); nav("/login"); }}>
            {collapsed ? "↪" : "Sign out"}
          </button>
        </div>
      </aside>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
    </>
  );
}
