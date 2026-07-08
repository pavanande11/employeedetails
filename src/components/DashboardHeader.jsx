export default function DashboardHeader({ icon, title, subtitle }) {
  return (
    <header className="dashboard-header">
      <div className="header-icon">{icon}</div>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}
