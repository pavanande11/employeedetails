import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { apiFetch } from "../api";
import DashboardHeader from "../components/DashboardHeader";
import FacultyForm from "../components/FacultyForm";
import EmployeeIdManager from "../components/EmployeeIdManager";
import { createEmptyForm } from "../data/facultyForm";

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function parseExperienceYears(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const text = String(value).trim().toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)/);

  return match ? Number(match[1]) : null;
}

function calculateAge(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const alreadyHadBirthday =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());

  return alreadyHadBirthday ? age - 1 : age;
}

function isPhdQualification(record) {
  const highestQualification = normalizeText(record?.highestQualification);
  const phdDetails = normalizeText(`${record?.phdStudyDetails ?? ""} ${record?.highestQualificationOther ?? ""}`);

  return /phd|doctorate|doctor of philosophy|ph\.d/.test(`${highestQualification} ${phdDetails}`);
}

export default function AdminDashboard({ auth }) {
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [employeeStatusList, setEmployeeStatusList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(createEmptyForm);
  const [status, setStatus] = useState("");

  useEffect(() => {
    apiFetch("/admin/submissions", auth.token)
      .then((data) => {
        setSubmissions(data.submissions);
        if (data.submissions.length) {
          setSelectedId(data.submissions[0].id);
          setForm(data.submissions[0]);
        }
      })
      .catch((err) => setStatus(err.message));

    apiFetch("/admin/unregistered-employees", auth.token)
      .then((data) => {
        const registeredIds = new Set((data.registeredEmployeeIds || []).map((id) => String(id)));
        const listedIds = new Set((data.employeeIds || []).map((id) => String(id)));
        const combined = Array.from(listedIds).map((employeeId) => ({
          employeeId,
          status: registeredIds.has(employeeId) ? "Registered" : "Unregistered"
        }));
        setEmployeeStatusList(combined);
      })
      .catch(() => setEmployeeStatusList([]));
  }, [auth]);

  const selectedRecord = useMemo(
    () => submissions.find((item) => item.id === selectedId),
    [selectedId, submissions]
  );

  const stats = useMemo(() => {
    const records = Array.isArray(submissions) ? submissions : [];
    const categoryCounts = records.reduce((acc, record) => {
      const category = String(record?.category || "Not provided").trim() || "Not provided";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryGenderBreakdown = records.reduce((acc, record) => {
      const category = String(record?.category || "Not provided").trim() || "Not provided";
      const gender = normalizeText(record?.gender);
      if (!acc[category]) {
        acc[category] = { male: 0, female: 0 };
      }

      if (gender.includes("female")) {
        acc[category].female += 1;
      } else if (gender.includes("male")) {
        acc[category].male += 1;
      }

      return acc;
    }, {});

    const genderCounts = records.reduce(
      (acc, record) => {
        const gender = normalizeText(record?.gender);
        if (gender.includes("female")) {
          acc.female += 1;
        } else if (gender.includes("male")) {
          acc.male += 1;
        }
        return acc;
      },
      { male: 0, female: 0 }
    );

    const ages = records
      .map((record) => calculateAge(record?.dateOfBirth))
      .filter((value) => value !== null);
    const averageAge = ages.length
      ? (ages.reduce((sum, value) => sum + value, 0) / ages.length).toFixed(1)
      : "0.0";

    const experienceBuckets = [2, 3, 5, 10, 15].map((threshold) => ({
      threshold,
      count: records.filter((record) => {
        const years = parseExperienceYears(record?.klUniversityExperience);
        return years !== null && years >= threshold;
      }).length
    }));

    const phdCount = records.filter(isPhdQualification).length;

    return {
      totalFaculty: records.length,
      categoryCounts,
      categoryGenderBreakdown,
      genderCounts,
      maleFemaleRatio: `${genderCounts.male}:${genderCounts.female}`,
      averageAge,
      experienceBuckets,
      phdCount,
      nonPhdCount: records.length - phdCount
    };
  }, [submissions]);

  const selectRecord = (record) => {
    setSelectedId(record.id);
    setForm(record);
    setStatus("");
  };

  const save = async (event) => {
    event.preventDefault();

    if (!selectedId) {
      setStatus("Select a record to update.");
      return;
    }

    setStatus("Saving...");

    try {
      const data = await apiFetch(`/admin/submissions/${selectedId}`, auth.token, {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setSubmissions((items) =>
        items.map((item) => (item.id === selectedId ? data.submission : item))
      );
      setForm(data.submission);
      setStatus("Record updated in server/data/submissions.json.");
    } catch (err) {
      setStatus(err.message);
    }
  };

  const deleteRecord = async (recordId) => {
    if (!window.confirm("Delete this faculty record?")) {
      return;
    }

    setStatus("Deleting...");

    try {
      await apiFetch(`/admin/submissions/${recordId}`, auth.token, {
        method: "DELETE"
      });

      const nextSubmissions = submissions.filter((item) => item.id !== recordId);
      setSubmissions(nextSubmissions);

      if (selectedId === recordId) {
        const nextRecord = nextSubmissions[0] || null;
        setSelectedId(nextRecord ? nextRecord.id : "");
        setForm(nextRecord ? nextRecord : createEmptyForm());
      }

      setStatus("Record deleted from server/data/submissions.json.");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <DashboardHeader
        icon={<ShieldCheck size={30} />}
        title="Backend Dashboard"
        subtitle="Review submitted data and manage employee IDs."
      />

      <div style={{ marginBottom: "20px", borderBottom: "2px solid #e4ebf1" }}>
        <div style={{ display: "flex", gap: "0" }}>
          <button
            onClick={() => setActiveTab("submissions")}
            style={{
              padding: "12px 24px",
              border: "none",
              backgroundColor: activeTab === "submissions" ? "#176f9a" : "transparent",
              color: activeTab === "submissions" ? "#ffffff" : "#64748b",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              borderBottom: activeTab === "submissions" ? "3px solid #176f9a" : "none"
            }}
          >
            Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab("employee-ids")}
            style={{
              padding: "12px 24px",
              border: "none",
              backgroundColor: activeTab === "employee-ids" ? "#176f9a" : "transparent",
              color: activeTab === "employee-ids" ? "#ffffff" : "#64748b",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              borderBottom: activeTab === "employee-ids" ? "3px solid #176f9a" : "none"
            }}
          >
            Manage Employee IDs
          </button>
        </div>
      </div>

      {activeTab === "submissions" ? (
        <>
          <section className="stats-panel">
            <div className="stats-header">
              <strong>Faculty Statistics</strong>
              <span>Summary of submitted faculty profiles</span>
            </div>

            <div className="stats-grid">
              <div className="stats-card">
                <span>Total faculty</span>
                <strong>{stats.totalFaculty}</strong>
              </div>
              <div className="stats-card">
                <span>Male / Female</span>
                <strong>{stats.maleFemaleRatio}</strong>
              </div>
              <div className="stats-card">
                <span>Average age</span>
                <strong>{stats.averageAge} yrs</strong>
              </div>
              <div className="stats-card">
                <span>PhD / Non-PhD</span>
                <strong>
                  {stats.phdCount} / {stats.nonPhdCount}
                </strong>
              </div>
            </div>

            <div className="stats-grid secondary">
              <div className="stats-card wide">
                <span>Category / caste by gender</span>
                <div className="stats-list">
                  {Object.entries(stats.categoryGenderBreakdown).length ? (
                    Object.entries(stats.categoryGenderBreakdown).map(([category, counts]) => (
                      <div className="stats-list-item" key={category}>
                        <span>{category}</span>
                        <strong>
                          M: {counts.male} / F: {counts.female}
                        </strong>
                      </div>
                    ))
                  ) : (
                    <div className="muted">No category data available yet.</div>
                  )}
                </div>
              </div>

              <div className="stats-card">
                <span>KL experience buckets</span>
                <div className="stats-list">
                  {stats.experienceBuckets.map((bucket) => (
                    <div className="stats-list-item" key={bucket.threshold}>
                      <span>{bucket.threshold}+</span>
                      <strong>{bucket.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="stats-grid secondary">
              <div className="stats-card wide">
                <span>Employee registration status</span>
                <strong>{employeeStatusList.filter((item) => item.status === "Unregistered").length} unregistered</strong>
                <div className="stats-list">
                  {employeeStatusList.length ? (
                    employeeStatusList.map((employee) => (
                      <div className="stats-list-item" key={employee.employeeId}>
                        <span>{employee.employeeId}</span>
                        <strong>{employee.status}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="muted">No employee registration data available yet.</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="admin-grid">
            <div className="record-list">
            <div className="section-title">
              <strong>Records</strong>
              <span>{submissions.length} total</span>
            </div>
            {submissions.length === 0 ? (
              <div className="empty-state">No faculty details submitted yet.</div>
            ) : (
              submissions.map((record) => (
                <div
                  className={`record-row ${record.id === selectedId ? "selected" : ""}`}
                  key={record.id}
                >
                  <button
                    type="button"
                    className="record-row-main"
                    onClick={() => selectRecord(record)}
                  >
                    <strong>{record.facultyName || record.employeeId}</strong>
                    <span>{record.designation || "Faculty record"}</span>
                  </button>
                  <button
                    type="button"
                    className="record-row-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteRecord(record.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

            <div>
              {selectedRecord ? (
                <FacultyForm form={form} setForm={setForm} onSubmit={save} status={status} />
              ) : (
                <div className="loading-box">Select a submitted record to edit.</div>
              )}
            </div>
          </section>
        </>
      ) : (
        <EmployeeIdManager auth={auth} />
      )}
    </>
  );
}
