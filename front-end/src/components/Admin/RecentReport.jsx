function RecentReports() {
    const reports = [
      {
        title: "Weekly Water Quality Report",
        desc: "Summary of pH, turbidity, and chlorine levels from last week.",
        date: "June 15, 2024",
        img: "https://storage.googleapis.com/a1aa/image/9c280b5f-0de2-4e33-48ea-a7cf201da98c.jpg",
      },
      {
        title: "Turbidity Analysis Report",
        desc: "Detailed turbidity measurements and filter performance evaluation.",
        date: "June 12, 2024",
        img: "https://storage.googleapis.com/a1aa/image/dd8d62a7-2b28-4d6f-8e42-2a0346ef8daf.jpg",
      },
      {
        title: "Flow Rate Daily Report",
        desc: "Monitoring flow rate consistency and identifying peak usage times.",
        date: "June 10, 2024",
        img: "https://storage.googleapis.com/a1aa/image/91c87575-e708-4d1b-7303-9277da729be6.jpg",
      },
    ];
  
    return (
      <section className="mb-10" id="reports">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Recent Reports</h2>
        <div className="space-y-6">
          {reports.map((report, index) => (
            <article key={index} className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <img src={report.img} alt={report.title} className="w-20 h-20 rounded-md object-cover" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.desc}</p>
                </div>
              </div>
              <time className="text-sm text-gray-500">{report.date}</time>
            </article>
          ))}
        </div>
      </section>
    );
  }
  
  export default RecentReports;
  