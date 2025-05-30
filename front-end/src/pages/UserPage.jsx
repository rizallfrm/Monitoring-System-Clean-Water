"use client";
import { useAuth } from "../Context/authContext";
import { useEffect, useState } from "react";
import Frame from "../components/UserPage/Frame";
import ProfileSection from "../components/UserPage/ProfileSection";
import ReportList from "../components/UserPage/ReportList";
import ReportForm from "../components/UserPage/ReportForm";
import authService from "../services/authService";
import reportService from "../services/reportService";
export default function UserPage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, reportsData] = await Promise.all([
          authService.getProfile(),
          reportService.getAllReports(),
        ]);
        console.log("Fetched reports:", reportsData); // ⬅️ Tambahkan ini

        setProfile(profileData);
        setReports(reportsData);
      } catch (err) {
        console.error("Fetch error:", err);

        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Frame>
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Profile Section */}
          <div className="lg:w-1/3">
            <ProfileSection profile={profile} />
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "reports"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("reports")}
                >
                  My Reports
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "new"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("new")}
                >
                  New Report
                </button>
              </div>

              {activeTab === "reports" ? (
                <ReportList reports={reports} />
              ) : (
                <ReportForm
                  onReportCreated={(newReport) => {
                    setReports([newReport, ...reports]);
                    setActiveTab("reports");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}
