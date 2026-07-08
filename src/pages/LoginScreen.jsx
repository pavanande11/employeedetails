import { useState } from "react";
import { Database, ShieldCheck, UserPlus } from "lucide-react";
import { apiFetch } from "../api";

const emptyRegisterForm = {
  employeeId: "",
  name: "",
  email: "",
  password: ""
};

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiFetch("/login", null, {
        method: "POST",
        body: JSON.stringify({ employeeId, password })
      });
      onLogin(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiFetch("/register", null, {
        method: "POST",
        body: JSON.stringify(registerForm)
      });
      setEmployeeId(registerForm.employeeId);
      setPassword(registerForm.password);
      setRegisterForm(emptyRegisterForm);
      setMode("login");
      setMessage(`${data.message} You can log in now.`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRegister = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-copy">
          <Database size={34} />
          <h1>Data Desk</h1>
          <p>Register with Employee ID, submit faculty data, and manage backend updates.</p>
        </div>

        <div className="login-form">
          <div className="segmented-control" aria-label="Choose account action">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>

          {mode === "login" && (
            <LoginForm
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onSubmit={submitLogin}
            />
          )}

          {mode === "register" && (
            <RegisterForm
              form={registerForm}
              update={updateRegister}
              loading={loading}
              onSubmit={submitRegister}
            />
          )}

          {message && <div className="error-box">{message}</div>}
        </div>
      </section>
    </main>
  );
}

function LoginForm({
  employeeId,
  setEmployeeId,
  password,
  setPassword,
  loading,
  onSubmit
}) {
  return (
    <form className="stacked-form" onSubmit={onSubmit}>
      <label>
        Employee ID
        <input
          required
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          placeholder="Enter your employee ID"
        />
      </label>

      <label>
        Password
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        <ShieldCheck size={18} />
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}

function RegisterForm({ form, update, loading, onSubmit }) {
  return (
    <form className="stacked-form" onSubmit={onSubmit}>
      <label>
        Employee ID
        <input
          required
          value={form.employeeId}
          onChange={(event) => update("employeeId", event.target.value)}
          placeholder="Example: 6283"
          validationPattern="^\d{3,5}$"
          validationMessage="Please enter a valid employee ID"
        />
      </label>
      <label>
        Name
        <input
          required
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Enter your name"
        />
      </label>
      <label>
        Email
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          placeholder="Enter email"
        />
      </label>
      <label>
        Password
        <input
          required
          type="password"
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          placeholder="Create password"
        />
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        <UserPlus size={18} />
        {loading ? "Checking..." : "Register"}
      </button>
    </form>
  );
}
