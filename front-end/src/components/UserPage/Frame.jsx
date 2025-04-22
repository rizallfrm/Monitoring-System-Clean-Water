"use client";
import React from "react";
import DashboardHeader from "./DashboardHeader";
import MetricCard from "./MetricCard";
import ActivityList from "./ActivityList";
import MaintenancePanel from "./MaintenancePanel";
import NotificationPanel from "./NotificationPanel";
import DashboardFooter from "./DashboardFooter";

export default function Frame() {
  return (
    <div className="overflow-hidden bg-white rounded-lg border-2 border-gray-300 border-solid">
      <main className="w-full bg-black bg-opacity-0 max-md:max-w-full">
        <div className="flex flex-col w-full bg-gray-50 pb-[501px] max-md:pb-24 max-md:max-w-full">
          <DashboardHeader />

          <section className="self-center px-3.5 py-8 w-full max-w-screen-xl bg-black bg-opacity-0 max-md:max-w-full">
            <div className="p-0.5 bg-black bg-opacity-0 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                <MetricCard
                  title="Konsumsi Air"
                  value="2,450 m³"
                  subtitle="Bulan April 2025"
                  icon="https://cdn.builder.io/api/v1/image/assets/TEMP/612386b01a703bc3c493c2add36edb65791f6453?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                  className="w-[33%] max-md:ml-0 max-md:w-full"
                />
                <MetricCard
                  title="Kualitas Air"
                  value="Normal"
                  subtitle="Update terakhir: 22 Apr 2025"
                  icon="https://cdn.builder.io/api/v1/image/assets/TEMP/aca8406948c8cb44df0b49aeec346e85d5d45fa7?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                  className="ml-5 w-[33%] max-md:ml-0 max-md:w-full"
                />
                <MetricCard
                  title="Tekanan Air"
                  value="2.5 bar"
                  subtitle="Status: Normal"
                  icon="https://cdn.builder.io/api/v1/image/assets/TEMP/0f09cdb3860beb18353391aa0eaab86d6c6faa24?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                  className="ml-5 w-[33%] max-md:ml-0 max-md:w-full"
                />
              </div>
            </div>

            <ActivityList />

            <div className="p-0.5 mt-8 bg-black bg-opacity-0 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                <MaintenancePanel />
                <NotificationPanel />
              </div>
            </div>
          </section>

          <DashboardFooter />
        </div>
      </main>
    </div>
  );
}
