"use client";
import { useEffect, useRef, useState } from 'react';

export function ActionModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    description: "",
    location: "",
    status: ""
  });

  const [errors, setErrors] = useState({
    description: "",
    location: "",
    status: ""
  });

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!form.description.trim()) {
      newErrors.description = "Deskripsi harus diisi";
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

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission here
      onClose();
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
      <div className="relative p-6 bg-white rounded-xl max-w-[500px] w-[90%]">
        <button
          className="absolute top-3 right-3 p-2 rounded cursor-pointer border-none"
          aria-label="Close modal"
          ref={closeButtonRef}
          onClick={onClose}
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
          Tambah Tindakan
        </h3>
        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium"
            >
              <span>Deskripsi </span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className={`px-3 py-2 w-full rounded-md min-h-[100px] ${
                errors.description ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setErrors({ ...errors, description: '' });
              }}
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium"
            >
              <span>Lokasi </span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              className={`px-3 py-2 w-full rounded-md ${
                errors.location ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.location}
              onChange={(e) => {
                setForm({ ...form, location: e.target.value });
                setErrors({ ...errors, location: '' });
              }}
              aria-required="true"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? 'location-error' : undefined}
            />
            {errors.location && (
              <p id="location-error" className="mt-1 text-xs text-red-500">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium"
            >
              <span>Status </span>
              <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              className={`px-3 py-2 w-full rounded-md ${
                errors.status ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.status}
              onChange={(e) => {
                setForm({ ...form, status: e.target.value });
                setErrors({ ...errors, status: '' });
              }}
              aria-required="true"
              aria-invalid={!!errors.status}
              aria-describedby={errors.status ? 'status-error' : undefined}
            >
              <option value="">Pilih status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
            {errors.status && (
              <p id="status-error" className="mt-1 text-xs text-red-500">
                {errors.status}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md cursor-pointer border-none"
              onClick={handleSubmit}
            >
              Simpan Tindakan
            </button>
            <button
              type="button"
              className="px-4 py-2 font-semibold text-gray-700 bg-white rounded-md border border-gray-200 cursor-pointer"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ActionModal;
