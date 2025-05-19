import { useState } from 'react';
import reportService from '../../services/reportService';

export default function ReportForm({ onReportCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'kualitas',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await reportService.createReport(formData);
      setSuccess(true);
      setFormData({
        title: '',
        type: 'kualitas',
        description: '',
        location: ''
      });
      if (onReportCreated) {
        onReportCreated();
      }
    } catch (err) {
      setError(err.message || 'Gagal membuat laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Buat Laporan Baru</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Laporan berhasil dibuat!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Judul Laporan</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Jenis Masalah</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="kualitas">Kualitas Air</option>
            <option value="pipa">Kerusakan Pipa</option>
            <option value="tekanan">Tekanan Air</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Lokasi</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </form>
    </div>
  );
}