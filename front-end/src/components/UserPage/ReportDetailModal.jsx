import React, { useState, useEffect } from "react";
import reportService from "../../services/reportService";
import {
  AlertCircle,
  X,
  Calendar,
  User,
  MapPin,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Eye,
  Download,
  Share2,
  Droplets,
  Activity,
  FileText,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";
import actionService from "../../services/actionService";

// StatusTimeline Component with enhanced visual design

const ActionsList = ({ actions, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border-2 border-gray-200 shadow-lg mb-8">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="w-8 h-8 text-gray-400 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 border-2 border-red-200 shadow-lg mb-8">
        <div className="flex items-center justify-center text-red-600">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!actions || actions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border-2 border-gray-200 shadow-lg mb-8">
        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">
          Belum ada tindakan yang dilakukan
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Petugas belum menambahkan tindakan
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="ml-4 text-xl font-bold text-gray-900">
            Tindakan yang Dilakukan
          </h4>
        </div>
        <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
          {actions.length} Tindakan
        </span>
      </div>

      <div className="space-y-6">
        {actions.map((action, index) => (
          <div key={index} className="border-l-4 border-green-500 pl-6 py-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">
                    {action.performer?.name || "Petugas tidak diketahui"}
                  </p>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {new Date(action.performed_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {action.action_description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(action.performed_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Image Gallery Component
const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Ekstrak URL gambar dari array images
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

      {/* Image Modal */}
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

const ReportDetail = ({ report, statusHistory, onClose, loading }) => {
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actions, setActions] = useState([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [actionsError, setActionsError] = useState(null);

  const loadActionsForReport = async (reportId) => {
    setIsLoadingActions(true);
    setActionsError(null);
    try {
      const response = await actionService.getActionsByReportId(reportId);
      console.log("Response dari API:", response);
      if (response.status === "success") {
        setActions(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.message || "Gagal memuat tindakan");
      }
    } catch (error) {
      console.error("Gagal memuat tindakan:", error);
      setActionsError(error.message);
      setActions([]);
    } finally {
      setIsLoadingActions(false);
    }
  };

  useEffect(() => {
    if (report?.report_id) {
      loadActionsForReport(report.report_id);
    }
  }, [report]);

  const handleCancelReport = async () => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan laporan ini?"))
      return;

    try {
      setIsCancelling(true);
      setError(null);

      await reportService.cancelReport(report.report_id);
      alert("Laporan berhasil dibatalkan");
      onClose();
    } catch (err) {
      console.error("Gagal membatalkan laporan:", err);
      setError(err.message || "Gagal membatalkan laporan");
    } finally {
      setIsCancelling(false);
    }
  };

  const formattedReport = {
    ...report,
    status: (report.status || "Pending").toLowerCase(),
    createdAt: report.created_at,
    updatedAt: report.updated_at || report.created_at,
  };
  const getStatusBadge = (status) => {
  // Konversi status ke lowercase untuk memudahkan pengecekan
  const statusLower = (status || "").toLowerCase();
  
  const statusConfig = {
    pending: {
      bg: "bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100",
      text: "text-amber-800",
      border: "border-amber-300 shadow-amber-100",
      icon: <Clock className="w-4 h-4" />,
      pulse: "animate-pulse",
      displayText: "Menunggu" // Teks yang akan ditampilkan
    },
    "on-going": {
      bg: "bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100",
      text: "text-blue-800",
      border: "border-blue-300 shadow-blue-100",
      icon: <Activity className="w-4 h-4" />,
      pulse: "",
      displayText: "Dikerjakan"
    },
    completed: {
      bg: "bg-gradient-to-r from-green-100 via-emerald-100 to-green-100",
      text: "text-green-800",
      border: "border-green-300 shadow-green-100",
      icon: <CheckCircle className="w-4 h-4" />,
      pulse: "",
      displayText: "Selesai"
    },
    cancel: {
      bg: "bg-gradient-to-r from-red-100 via-rose-100 to-red-100",
      text: "text-red-800",
      border: "border-red-300 shadow-red-100",
      icon: <XCircle className="w-4 h-4" />,
      pulse: "",
      displayText: "Dibatalkan"
    },
  };

  // Cari konfigurasi yang sesuai, gunakan pending sebagai default
  const config = statusConfig[statusLower] || statusConfig.pending;

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 shadow-lg ${config.bg} ${config.text} ${config.border} ${config.pulse}`}
    >
      {config.icon}
      <span className="ml-2">{config.displayText}</span>
    </div>
  );
};

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-200">
        {/* Enhanced Header with Water Theme */}
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-8 text-white overflow-hidden">
          {/* Animated Water Drops Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 animate-bounce delay-100">
              <Droplets className="w-8 h-8" />
            </div>
            <div className="absolute top-12 right-16 animate-bounce delay-300">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="absolute bottom-8 left-20 animate-bounce delay-500">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div className="relative flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="p-3 bg-white/20 rounded-xl mr-4">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    Monitoring Kualitas Air PDAM
                  </h2>
                  <p className="text-blue-100 text-base flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    ID Laporan: {formattedReport.report_id || "N/A"}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Status Aktif</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Real-time</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 transform hover:scale-110"
              disabled={isCancelling}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="p-8">
            {/* Error Alert with Enhanced Design */}
            {error && (
              <div className="mb-8 p-6 bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-200 rounded-2xl shadow-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-red-100 rounded-xl mr-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-800 text-base font-semibold mb-1">
                      Terjadi Kesalahan
                    </p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="ml-3 p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div
                    className="w-20 h-20 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0"
                    style={{
                      clipPath: "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Droplets className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-600 text-lg font-medium">
                  Memuat detail laporan...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Sistem sedang mengambil data terbaru
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Enhanced Status and Title Section */}
                <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      {getStatusBadge(formattedReport.status)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {formattedReport.title || "Deskripsi Laporan:"}
                  </h3>
                  <div className="bg-white/60 rounded-xl p-6 border border-white/50">
                    <p className="text-gray-800 leading-relaxed text-base">
                      {formattedReport.description ||
                        "Tidak ada deskripsi tersedia."}
                    </p>
                  </div>
                </div>

                {/* Enhanced Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="ml-4 text-base font-bold text-gray-900">
                        Lokasi
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                      {formattedReport.location || "Tidak ada lokasi"}
                    </p>
                  </div>

                  <div className="group bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="ml-4 text-base font-bold text-gray-900">
                        Tanggal Dibuat
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      {new Date(formattedReport.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-gray-500 text-xs mt-2 bg-white/50 rounded-lg px-2 py-1">
                      {new Date(formattedReport.createdAt).toLocaleTimeString(
                        "id-ID"
                      )}
                    </p>
                  </div>

                  <div className="group bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="ml-4 text-base font-bold text-gray-900">
                        Pelapor
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      {formattedReport.reporter?.name || "Tidak diketahui"}
                    </p>
                    {formattedReport.reporter?.email && (
                      <p className="text-gray-500 text-xs mt-2 bg-white/50 rounded-lg px-2 py-1">
                        {formattedReport.reporter.email}
                      </p>
                    )}
                  </div>

                  <div className="group bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <h4 className="ml-4 text-base font-bold text-gray-900">
                        Update Terakhir
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      {new Date(formattedReport.updatedAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                    <p className="text-gray-500 text-xs mt-2 bg-white/50 rounded-lg px-2 py-1">
                      {new Date(formattedReport.updatedAt).toLocaleTimeString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
                <ActionsList
                  actions={actions}
                  isLoading={isLoadingActions}
                  error={actionsError}
                />
                {/* Images Section */}
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
                    {formattedReport.images &&
                      formattedReport.images.length > 0 && (
                        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                          {formattedReport.images.length} Gambar
                        </span>
                      )}
                  </div>
                  <ImageGallery images={formattedReport.images} />
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer Actions */}
          <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 px-8 py-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Sistem Monitoring Air PDAM</p>
                <p className="text-xs">Terintegrasi dengan dashboard utama</p>
              </div>
              <div className="flex space-x-4">
                {formattedReport.status === "pending" && (
                  <button
                    onClick={handleCancelReport}
                    disabled={isCancelling}
                    className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                      isCancelling
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-2xl"
                    }`}
                  >
                    {isCancelling ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                        Memproses...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        Batalkan Laporan
                      </div>
                    )}
                  </button>
                )}

                <button
                  onClick={onClose}
                  disabled={isCancelling}
                  className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <X className="w-4 h-4 mr-2" />
                    Tutup
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
