import { format } from "date-fns";
import { id } from "date-fns/locale";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "On-Going": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancel: "bg-red-100 text-red-800"
};

export default function ReportCard({ report, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{report.description.substring(0, 50)}...</h3>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(report.created_at), "dd MMMM yyyy", { locale: id })}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[report.status]
          }`}
        >
          {report.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Lokasi: {report.location}
      </p>
    </div>
  );
}