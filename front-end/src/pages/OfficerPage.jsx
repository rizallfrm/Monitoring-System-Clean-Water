import React, { useEffect, useState } from "react";
import reportService from "../services/reportService";
import actionService from "../services/actionService";
import statusService from "../services/statusService";
import userService from "../services/userService";

const OfficerPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actions, setActions] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [newAction, setNewAction] = useState({ description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Load detail when selectedReportId changes
  useEffect(() => {
    if (!selectedReportId) {
      setSelectedReport(null);
      setActions([]);
      setStatusHistory([]);
      return;
    }
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        // 1. Get report detail
        const report = await reportService.getReportById(selectedReportId);
        setSelectedReport(report);

        // 2. Get actions linked to report
        const actionList = await actionService.getActionsByReportId(selectedReportId);
        setActions(actionList);

        // 3. Get status history
        const statusList = await statusService.getStatusHistoryByReportId(selectedReportId);
        setStatusHistory(statusList);

        // 4. Get officers (for assignment dropdown, optional)
        const officersList = await userService.getOfficers();
        setOfficers(officersList);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchReportDetails();
  }, [selectedReportId]);

  // Handler tambah tindakan
  const handleAddAction = async () => {
    if (!newAction.description.trim()) return alert("Deskripsi tindakan harus diisi!");
    try {
      setLoading(true);
      await actionService.createAction({
        reportId: selectedReportId,
        description: newAction.description,
      });
      // Refresh actions list setelah tambah
      const updatedActions = await actionService.getActionsByReportId(selectedReportId);
      setActions(updatedActions);
      setNewAction({ description: "" });
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  // Render list laporan
  const renderReportList = () => (
    <div style={{ width: "30%", borderRight: "1px solid #ccc", paddingRight: "1rem" }}>
      <h2>Daftar Laporan</h2>
      {loading && !selectedReportId && <p>Loading reports...</p>}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {reports.map((r) => (
          <li key={r.id} style={{ marginBottom: "0.5rem" }}>
            <button
              style={{
                backgroundColor: selectedReportId === r.id ? "#007bff" : "#eee",
                color: selectedReportId === r.id ? "#fff" : "#000",
                border: "none",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
              onClick={() => setSelectedReportId(r.id)}
            >
              #{r.id} - {r.title || r.subject || "No title"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render detail laporan + actions + status
  const renderReportDetail = () => {
    if (!selectedReport) return <p>Pilih laporan untuk lihat detail.</p>;
    return (
      <div style={{ width: "70%", paddingLeft: "1rem" }}>
        <h2>Detail Laporan #{selectedReport.id}</h2>
        <p><strong>Judul:</strong> {selectedReport.title || selectedReport.subject || "–"}</p>
        <p><strong>Deskripsi:</strong> {selectedReport.description || "–"}</p>
        <p><strong>Status:</strong> {selectedReport.status || "–"}</p>
        <p><strong>Tanggal Dibuat:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>

        <hr />

        <h3>Tindakan</h3>
        {loading && <p>Loading actions...</p>}
        <ul>
          {actions.length === 0 && <li>Tidak ada tindakan.</li>}
          {actions.map((a) => (
            <li key={a.id}>
              <strong>{a.description}</strong> — <em>{new Date(a.createdAt).toLocaleString()}</em>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "1rem" }}>
          <textarea
            placeholder="Deskripsi tindakan baru..."
            rows={3}
            value={newAction.description}
            onChange={(e) => setNewAction({ description: e.target.value })}
            style={{ width: "100%" }}
          />
          <button onClick={handleAddAction} disabled={loading} style={{ marginTop: "0.5rem" }}>
            Tambah Tindakan
          </button>
        </div>

        <hr />

        <h3>Riwayat Status</h3>
        <ul>
          {statusHistory.length === 0 && <li>Tidak ada riwayat status.</li>}
          {statusHistory.map((s) => (
            <li key={s.id}>
              <strong>{s.status}</strong> — <em>{new Date(s.createdAt).toLocaleString()}</em>
            </li>
          ))}
        </ul>

        <hr />

        <h3>Penugasan Officer</h3>
        <p>Penugasan dan update status bisa ditambahkan di sini sesuai kebutuhan.</p>
        {/* Bisa ditambah dropdown select untuk assign officer dan tombol update laporan */}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {renderReportList()}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {renderReportDetail()}
    </div>
  );
};

export default OfficerPage;
