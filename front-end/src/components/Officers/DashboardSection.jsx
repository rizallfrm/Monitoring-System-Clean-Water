import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import reportService from "../../services/reportService";
import statusService from "../../services/statusService";

export function DashboardSection() {
  const [stats, setStats] = useState([
    { 
      title: "Total Laporan", 
      value: "0", 
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#6366F1" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M4 6h16M4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6M4 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
        </svg>
      )
    },
    { 
      title: "Menunggu", 
      value: "0", 
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#EAB308" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        </svg>
      )
    },
    { 
      title: "Selesai", 
      value: "0", 
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#22C55E" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      )
    },
    { 
      title: "Dibatalkan", 
      value: "0", 
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#DC2626" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636L5.636 18.364M12 21c4.9706 0 9-4.0294 9-9s-4.0294-9-9-9-9 4.0294-9 9 4.0294 9 9 9z"/>
        </svg>
      )
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Menggunakan dua endpoint berbeda untuk mendapatkan data yang lebih akurat
        const [reportsResponse, statusStatsResponse] = await Promise.all([
          reportService.getAllReports(),
          statusService.getStatusStatistics()
        ]);

        // Data dari reportService
        const reports = reportsResponse.data || reportsResponse;
        
        // Data dari statusService (jika tersedia)
        const statusStats = statusStatsResponse.data || statusStatsResponse;

        // Prioritaskan data dari statusService jika tersedia
        const total = reports.length;
        const menunggu = statusStats.menunggu || reports.filter(r => r.status === 'Menunggu').length;
        const selesai = statusStats.selesai || reports.filter(r => r.status === 'Selesai' || r.status === 'Complete').length;
        const dibatalkan = statusStats.dibatalkan || reports.filter(r => r.status === 'Dibatalkan' || r.status === 'Cancel').length;

        setStats([
          { ...stats[0], value: total.toString() },
          { ...stats[1], value: menunggu.toString() },
          { ...stats[2], value: selesai.toString() },
          { ...stats[3], value: dibatalkan.toString() }
        ]);

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Gagal memuat statistik. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="flex flex-col gap-6 mb-10 w-[1104px] max-md:w-full">
        <h2 className="text-xl font-bold leading-5 text-gray-900 max-sm:text-lg">
          Statistik Laporan
        </h2>
        <div className="flex gap-6 w-[1104px] max-md:flex-wrap max-md:gap-4 max-md:w-full max-sm:flex-col">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value="Loading..."
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-6 mb-10 w-[1104px] max-md:w-full">
        <h2 className="text-xl font-bold leading-5 text-gray-900 max-sm:text-lg">
          Statistik Laporan
        </h2>
        <div className="text-red-500 p-4">{error}</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 mb-10 w-[1104px] max-md:w-full">
      <h2 className="text-xl font-bold leading-5 text-gray-900 max-sm:text-lg">
        Statistik Laporan
      </h2>
      <div className="flex gap-6 w-[1104px] max-md:flex-wrap max-md:gap-4 max-md:w-full max-sm:flex-col">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>
    </section>
  );
}

export default DashboardSection;