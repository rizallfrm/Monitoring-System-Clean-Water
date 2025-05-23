"use client";
import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import MetricCard from "./MetricCard";
import ActivityList from "./ActivityList";
import MaintenancePanel from "./MaintenancePanel";
import NotificationPanel from "./NotificationPanel";
import DashboardFooter from "./DashboardFooter";
import ReportForm from "./ReportForm";

export default function Frame() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReportCreated = () => {
    setShowReportForm(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh of other components
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg border-2 border-gray-300 border-solid">
      <main className="w-full bg-black bg-opacity-0 max-md:max-w-full">
        <div className="flex flex-col w-full bg-gray-50 pb-[501px] max-md:pb-24 max-md:max-w-full">
          <DashboardHeader />
          
          <section className="self-center px-3.5 py-8 w-full max-w-screen-xl bg-black bg-opacity-0 max-md:max-w-full">
            {showReportForm ? (
              <ReportForm onReportCreated={handleReportCreated} />
            ) : (
              <>
                <div className="p-0.5 bg-black bg-opacity-0 max-md:max-w-full">
                  <div className="flex gap-5 max-md:flex-col">
                    <MetricCard
                      title="Konsumsi Air"
                      className="w-[33%] max-md:ml-0 max-md:w-full"
                    />
                    <MetricCard
                      title="Kualitas Air"
                      className="ml-5 w-[33%] max-md:ml-0 max-md:w-full"
                    />
                    <MetricCard
                      title="Tekanan Air"
                      className="ml-5 w-[33%] max-md:ml-0 max-md:w-full"
                    />
                  </div>
                </div>

                <ActivityList key={refreshKey} />

                <div className="p-0.5 mt-8 bg-black bg-opacity-0 max-md:max-w-full">
                  <div className="flex gap-5 max-md:flex-col">
                    <MaintenancePanel key={`maintenance-${refreshKey}`} />
                    <NotificationPanel key={`notification-${refreshKey}`} />
                  </div>
                </div>

                <button
                  onClick={() => setShowReportForm(true)}
                  className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Buat Laporan Baru
                </button>
              </>
            )}
          </section>

          <DashboardFooter />
        </div>
      </main>
    </div>
  );
}