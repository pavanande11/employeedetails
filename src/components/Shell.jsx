import { Database, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { apiFetch } from "../api";

export default function Shell({ auth, onLogout, setRoute, children }) {
  const isAdmin = auth.user.role === "admin";

  const logout = async () => {
    try {
      await apiFetch("/logout", auth.token, { method: "POST" });
    } finally {
      onLogout();
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Database size={26} />
          <span>Data Desk</span>
        </div>
        <div className="role-card">
          {isAdmin ? <ShieldCheck size={28} /> : <UserRound size={28} />}
          <div>
            <strong>{auth.user.name}</strong>
            <span>{isAdmin ? "Backend dashboard" : "User dashboard"}</span>
          </div>
        </div>

        {!isAdmin && (
          <div className="nav-actions">
            <button className="ghost-button" onClick={() => setRoute("profile")}>
              Open Faculty Form
            </button>
            <button className="ghost-button" onClick={() => setRoute("password")}>
              Change Password
            </button>
          </div>
        )}

        <button className="ghost-button" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}
