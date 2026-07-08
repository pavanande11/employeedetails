import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { apiFetch } from "../api";

export default function EmployeeIdManager({ auth }) {
  const [employeeIds, setEmployeeIds] = useState([]);
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [bulkIds, setBulkIds] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isBulkMode, setIsBulkMode] = useState(false);

  useEffect(() => {
    fetchEmployeeIds();
  }, [auth]);

  const fetchEmployeeIds = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/employee-ids", auth.token);
      setEmployeeIds(data.employeeIds || []);
      setStatus("");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployeeId = async (event) => {
    event.preventDefault();
    const trimmedId = newEmployeeId.trim();

    if (!trimmedId) {
      setStatus("Please enter an employee ID.");
      return;
    }

    setStatus("Adding...");

    try {
      const data = await apiFetch("/admin/employee-ids", auth.token, {
        method: "POST",
        body: JSON.stringify({ employeeId: trimmedId })
      });
      setEmployeeIds(data.employeeIds);
      setNewEmployeeId("");
      setStatus("Employee ID added successfully!");
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleBulkAddEmployeeIds = async (event) => {
    event.preventDefault();
    const ids = bulkIds
      .split(/[\n,\s]+/)
      .map((id) => id.trim())
      .filter((id) => id);

    if (ids.length === 0) {
      setStatus("Please enter at least one employee ID.");
      return;
    }

    setStatus("Processing...");

    let addedCount = 0;
    let skippedCount = 0;
    const results = [];

    for (const id of ids) {
      try {
        const data = await apiFetch("/admin/employee-ids", auth.token, {
          method: "POST",
          body: JSON.stringify({ employeeId: id })
        });
        setEmployeeIds(data.employeeIds);
        addedCount++;
        results.push(`✓ ${id} added`);
      } catch (err) {
        skippedCount++;
        results.push(`✗ ${id} - ${err.message}`);
      }
    }

    setBulkIds("");
    setStatus(
      `Added: ${addedCount}, Skipped: ${skippedCount}. ${results.join(" | ")}`
    );
  };

  const handleDeleteEmployeeId = async (employeeId) => {
    if (!window.confirm(`Delete employee ID ${employeeId}?`)) {
      return;
    }

    setStatus("Deleting...");

    try {
      const data = await apiFetch(`/admin/employee-ids/${employeeId}`, auth.token, {
        method: "DELETE"
      });
      setEmployeeIds(data.employeeIds);
      setStatus("Employee ID deleted successfully!");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="detail-form">
      <h3 style={{ margin: "0 0 16px 0", color: "#176f9a" }}>Manage Employee IDs</h3>

      {loading ? (
        <div className="loading-box">Loading employee IDs...</div>
      ) : (
        <>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <button
                onClick={() => setIsBulkMode(false)}
                style={{
                  padding: "8px 16px",
                  border: !isBulkMode ? "2px solid #176f9a" : "1px solid #cbd7e2",
                  borderRadius: "6px",
                  backgroundColor: !isBulkMode ? "#176f9a" : "#ffffff",
                  color: !isBulkMode ? "#ffffff" : "#334155",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px"
                }}
              >
                Add Single
              </button>
              <button
                onClick={() => setIsBulkMode(true)}
                style={{
                  padding: "8px 16px",
                  border: isBulkMode ? "2px solid #176f9a" : "1px solid #cbd7e2",
                  borderRadius: "6px",
                  backgroundColor: isBulkMode ? "#176f9a" : "#ffffff",
                  color: isBulkMode ? "#ffffff" : "#334155",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px"
                }}
              >
                Add Bulk
              </button>
            </div>
          </div>

          {isBulkMode ? (
            <form onSubmit={handleBulkAddEmployeeIds} style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#334155", fontWeight: "600" }}>
                Paste employee IDs (comma or newline separated)
              </label>
              <textarea
                value={bulkIds}
                onChange={(e) => setBulkIds(e.target.value)}
                placeholder="6283&#10;6620&#10;3915&#10;1001&#10;1002&#10;9999"
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "12px",
                  border: "1px solid #cbd7e2",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  resize: "vertical"
                }}
              />
              <button
                className="primary-button"
                type="submit"
                style={{ marginTop: "12px" }}
              >
                <Plus size={18} />
                Add All
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddEmployeeId} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <input
                  type="text"
                  value={newEmployeeId}
                  onChange={(e) => setNewEmployeeId(e.target.value)}
                  placeholder="Enter employee ID"
                  style={{ flex: 1 }}
                />
                <button className="primary-button" type="submit">
                  <Plus size={18} />
                  Add
                </button>
              </div>
            </form>
          )}

          {status && (
            <div
              className={status.includes("✗") || status.includes("Error") || status.includes("Please") || status.includes("already") ? "error-box" : "success-box"}
              style={{ marginBottom: "12px" }}
            >
              {status}
            </div>
          )}

          <div style={{ border: "1px solid #d8e2ea", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "#f4f7fb", borderBottom: "1px solid #d8e2ea", fontWeight: "700", color: "#334155" }}>
              {employeeIds.length} Employee IDs
            </div>

            {employeeIds.length === 0 ? (
              <div style={{ padding: "24px", color: "#64748b", textAlign: "center" }}>
                No employee IDs found.
              </div>
            ) : (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {employeeIds.map((id) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderBottom: "1px solid #edf2f6"
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#25384c" }}>{id}</span>
                    <button
                      onClick={() => handleDeleteEmployeeId(id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #e74c3c",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        backgroundColor: "#fff5f5",
                        color: "#e74c3c",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600"
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
