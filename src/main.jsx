import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Shell from "./components/Shell";
import AdminDashboard from "./pages/AdminDashboard";
import LoginScreen from "./pages/LoginScreen";
import UserDashboard from "./pages/UserDashboard";
import { apiFetch } from "./api";
import "./styles.css";

function PasswordChangeView({ auth }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await apiFetch("/update-password", auth.token, {
        method: "PUT",
        body: JSON.stringify({
          employeeId: auth.user.employeeId,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      setForm({ currentPassword: "", newPassword: "" });
      setMessage("Password updated successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="route-landing">
      <h2>Change Password</h2>
      <p>Update your current password securely from this section.</p>
      <form className="stacked-form" onSubmit={submit}>
        <label>
          Current password
          <input
            required
            type="password"
            value={form.currentPassword}
            onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
          />
        </label>
        <label>
          New password
          <input
            required
            type="password"
            value={form.newPassword}
            onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
          />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
      {message && <div className={message.includes("success") ? "success-box" : "error-box"}>{message}</div>}
    </div>
  );
}

function DashboardContent({ auth, route, setRoute }) {
  if (route === "password") {
    return <PasswordChangeView auth={auth} />;
  }

  if (auth.user.role === "admin") {
    return <AdminDashboard auth={auth} />;
  }

  if (route === "profile") {
    return <UserDashboard auth={auth} />;
  }

  return (
    <div className="route-landing">
      <h2>Faculty Profile</h2>
      <p>Open the faculty form or change your password from here.</p>
      <div className="route-actions">
        <button className="primary-button" onClick={() => setRoute("profile")}>
          Open Faculty Form
        </button>
        <button className="ghost-button" onClick={() => setRoute("password")}>
          Change Password
        </button>
      </div>
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("dashboard-auth");
    return saved ? JSON.parse(saved) : null;
  });
  const [route, setRoute] = useState("home");

  const saveAuth = (nextAuth) => {
    setAuth(nextAuth);
    if (nextAuth) {
      localStorage.setItem("dashboard-auth", JSON.stringify(nextAuth));
    } else {
      localStorage.removeItem("dashboard-auth");
    }
  };

  if (!auth) {
    return <LoginScreen onLogin={saveAuth} />;
  }

  return (
    <Shell auth={auth} onLogout={() => saveAuth(null)} route={route} setRoute={setRoute}>
      <DashboardContent auth={auth} route={route} setRoute={setRoute} />
    </Shell>
  );
}

createRoot(document.getElementById("root")).render(<App />);
