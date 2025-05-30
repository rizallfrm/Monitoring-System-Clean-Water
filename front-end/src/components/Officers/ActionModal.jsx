"use client";
import { useEffect, useRef, useState } from 'react';
import actionService from '../../services/actionService';
import reportService from '../../services/reportService'; // For potential report association

export function ActionModal({ isOpen, onClose, onActionAdded, reportId, initialData }) {
  const [form, setForm] = useState({
    description: "",
    location: "",
    status: "pending",
    reportId: reportId || ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Status options with translations
  const statusOptions = [
    { value: "pending", label: "Menunggu" },
    { value: "in_progress", label: "Dalam Proses" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" }
  ];

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      resetForm();
      
      if (initialData) {
        setIsEditMode(true);
        setForm({
          description: initialData.description || "",
          location: initialData.location || "",
          status: initialData.status || "pending",
          reportId: initialData.reportId || reportId || ""
        });
      } else {
        setIsEditMode(false);
      }
    }
  }, [isOpen, initialData, reportId]);

  const resetForm = () => {
    setForm({
      description: "",
      location: "",
      status: "pending",
      reportId: reportId || ""
    });
    setErrors({});
    setApiError("");
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!form.description.trim()) {
      newErrors.description = "Deskripsi harus diisi";
      isValid = false;
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Deskripsi minimal 10 karakter";
      isValid = false;
    }

    if (!form.location.trim()) {
      newErrors.location = "Lokasi harus diisi";
      isValid = false;
    }

    if (!form.status) {
      newErrors.status = "Status harus dipilih";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      let response;
      const actionData = {
        description: form.description,
        location: form.location,
        status: form.status,
        ...(reportId && { reportId })
      };

      if (isEditMode && initialData?.id) {
        response = await actionService.updateAction(initialData.id, actionData);
      } else {
        response = await actionService.createAction(actionData);
      }

      if (onActionAdded) onActionAdded(response);
      onClose();
    } catch (error) {
      console.error('Action submission error:', error);
      setApiError(
        error.response?.data?.message || 
        error.message || 
        'Terjadi kesalahan saat menyimpan tindakan'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !window.confirm('Apakah Anda yakin ingin menghapus tindakan ini?')) return;

    try {
      await actionService.deleteAction(initialData.id);
      if (onActionAdded) onActionAdded({ action: 'delete', id: initialData.id });
      onClose();
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        error.message || 
        'Gagal menghapus tindakan'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
      ref={modalRef}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative p-6 bg-white rounded-xl max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 p-2 rounded cursor-pointer border-none"
          aria-label="Close modal"
          ref={closeButtonRef}
          onClick={onClose}
          disabled={loading}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 18L18 6M6 6L18 18"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <h3 id="modal-title" className="mb-5 text-lg font-semibold">
          {isEditMode ? "Edit Tindakan" : "Tambah Tindakan"}
        </h3>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
            {apiError}
            <button 
              onClick={() => setApiError("")}
              className="float-right text-red-800 hover:text-red-900"
              aria-label="Close error message"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {reportId && (
            <div className="p-3 bg-gray-50 rounded text-sm">
              <p className="font-medium">Terhubung dengan Laporan:</p>
              <p className="text-gray-600">ID: {reportId}</p>
            </div>
          )}

          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className={`px-3 py-2 w-full rounded-md min-h-[100px] border ${
                errors.description ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
              disabled={loading}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block mb-2 text-sm font-medium">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              className={`px-3 py-2 w-full rounded-md border ${
                errors.location ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.location}
              onChange={(e) => {
                setForm({ ...form, location: e.target.value });
                if (errors.location) setErrors({ ...errors, location: '' });
              }}
              aria-required="true"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? 'location-error' : undefined}
              disabled={loading}
            />
            {errors.location && (
              <p id="location-error" className="mt-1 text-xs text-red-500">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block mb-2 text-sm font-medium">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              className={`px-3 py-2 w-full rounded-md border ${
                errors.status ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.status}
              onChange={(e) => {
                setForm({ ...form, status: e.target.value });
                if (errors.status) setErrors({ ...errors, status: '' });
              }}
              aria-required="true"
              aria-invalid={!!errors.status}
              aria-describedby={errors.status ? 'status-error' : undefined}
              disabled={loading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p id="status-error" className="mt-1 text-xs text-red-500">
                {errors.status}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? "Menyimpan..." : "Membuat..."}
                </span>
              ) : (
                isEditMode ? "Simpan Perubahan" : "Buat Tindakan"
              )}
            </button>
            
            <button
              type="button"
              className="px-4 py-2 font-semibold text-gray-700 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            
            {isEditMode && (
              <button
                type="button"
                className="px-4 py-2 font-semibold text-red-600 bg-white rounded-md border border-red-200 hover:bg-red-50 ml-auto"
                onClick={handleDelete}
                disabled={loading}
              >
                Hapus
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActionModal;