import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { apiFetch } from "../api";
import DashboardHeader from "../components/DashboardHeader";
import FacultyForm from "../components/FacultyForm";
import { createEmptyForm } from "../data/facultyForm";

export default function UserDashboard({ auth }) {
  const [form, setForm] = useState(createEmptyForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/submission", auth.token)
      .then((data) => {
        const submission = data.submission || createEmptyForm();
        // Prefill employeeId from logged-in user
        submission.employeeId = auth.user.employeeId;
        setForm(submission);
      })
      .catch((err) => setStatus(err.message))
      .finally(() => setLoading(false));
  }, [auth]);

  const save = async (event) => {
    event.preventDefault();
    setStatus("Saving...");

    try {
      const data = await apiFetch("/submission", auth.token, {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setForm(data.submission);
      setStatus("Details saved in server/data/submissions.json.");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <DashboardHeader
        icon={<ClipboardList size={30} />}
        title="Faculty Dashboard"
        subtitle="Submit and update faculty profile details."
      />
      {loading ? (
        <div className="loading-box">Loading details...</div>
      ) : (
        <FacultyForm form={form} setForm={setForm} onSubmit={save} status={status} />
      )}
    </>
  );
}
