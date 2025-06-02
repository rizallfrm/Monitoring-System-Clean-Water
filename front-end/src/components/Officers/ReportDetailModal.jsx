import React, { useState } from "react";
import {
  XCircle,
  UserCheck,
  Eye,
  Edit,
  MapPin,
  Calendar,
  User,
  Flag,
  Loader2,
  Camera,
} from "lucide-react";
import statusService from "../../services/statusService";
import { toast } from "react-toastify";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const imageUrls =
    images
      ?.map((img) => (typeof img === "string" ? img : img?.url))
      .filter((url) => url) || [];

  if (imageUrls.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center border border-gray-200">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setSelectedImage(url)}
          >
            <img
              src={url}
              alt={`Lampiran ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300?text=Gambar+Tidak+Tersedia";
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {imageUrls.indexOf(selectedImage) + 1} / {imageUrls.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const StatusCard = ({ icon: Icon, title, children }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
    <div className="flex items-center mb-3">
      <div className="p-2 bg-blue-100 rounded-lg mr-3">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
    </div>
    {children}
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  value,
  gradientFrom,
  gradientTo,
  borderColor,
}) => (
  <div
    className={`bg-gradient-to-br from-${gradientFrom}/50 to-${gradientTo}/50 rounded-2xl p-6 border border-${borderColor}`}
  >
    <div className="flex items-center mb-3">
      <div className={`p-2 bg-${gradientFrom}-100 rounded-lg mr-3`}>
        <Icon className={`h-5 w-5 text-${gradientFrom}-600`} />
      </div>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
    </div>
    <p className="text-gray-800 font-medium text-lg">{value}</p>
  </div>
);

const ReportDetailModal = ({
  report,
  onClose,
  onAssign,
  onUpdateStatus,
  fetchReports,
}) => {
  if (!report) return null;

  const [selectedStatus, setSelectedStatus] = useState(
    report?.status || "Pending"
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    const colors = {
      pending:
        "bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-800 border-orange-200",
      "on-going":
        "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200",
      completed:
        "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200",
      cancelled:
        "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200",
    };
    return (
      colors[statusLower] ||
      "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200"
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-gradient-to-r from-red-500 to-rose-600",
      medium: "bg-gradient-to-r from-yellow-500 to-orange-500",
      low: "bg-gradient-to-r from-green-500 to-emerald-500",
    };
    return colors[priority] || "bg-gradient-to-r from-gray-500 to-slate-600";
  };

  const handleStatusUpdate = async () => {
    if (!report?.report_id || !selectedStatus) return;

    setIsUpdating(true);
    try {
      const statusData = {
        reportId: report.report_id,
        status: selectedStatus,
      };

      await statusService.createStatusUpdate(statusData);

      if (onUpdateStatus) {
        await onUpdateStatus(report.report_id, selectedStatus);
      }

      if (fetchReports) {
        await fetchReports();
      }

      toast.success("Status berhasil diperbarui");
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.message || "Gagal memperbarui status");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatStatusDisplay = (status) => {
    switch (status) {
      case "Pending":
        return "Menunggu";
      case "On-Going":
        return "Dikerjakan";
      case "Completed":
        return "Selesai";
      case "Cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-gray-200 animate-in slide-in-from-bottom-4 zoom-in-95 duration-400">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12"></div>

          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Flag className="h-6 w-6 mr-3" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {report.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{report.title}</h3>
              <p className="text-blue-100 text-sm">
                Laporan Detail - ID: #{report.report_id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Status and Priority Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusCard icon={Calendar} title="Status Laporan">
              <span
                className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-sm ${getStatusColor(
                  report.status
                )}`}
              >
                {formatStatusDisplay(report.status)}
              </span>
            </StatusCard>
          </div>

          {/* Description Card */}
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              Deskripsi Lengkap
            </h4>
            <p className="text-gray-700 leading-relaxed text-base bg-white/60 p-4 rounded-xl border border-blue-200">
              {report.description}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={MapPin}
              title="Lokasi Kejadian"
              value={report.location}
              gradientFrom="green"
              gradientTo="emerald"
              borderColor="green-100"
            />

            <InfoCard
              icon={User}
              title="Pelapor"
              value={report.reporter?.name || report.reporter}
              gradientFrom="orange"
              gradientTo="yellow"
              borderColor="orange-100"
            />
          </div>

          {/* Images Section */}
          {report.images && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Camera className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="ml-4 text-xl font-bold text-gray-900">
                    Dokumentasi Laporan
                  </h4>
                </div>
                {report.images.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {report.images.length} Gambar
                  </span>
                )}
              </div>
              <ImageGallery images={report.images} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                disabled={isUpdating}
              >
                <option value="Pending">Menunggu</option>
                <option value="On-Going">Dikerjakan</option>
                <option value="Completed">Selesai</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className={`flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg transform hover:scale-105 active:scale-95 ${
                  isUpdating
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                }`}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
