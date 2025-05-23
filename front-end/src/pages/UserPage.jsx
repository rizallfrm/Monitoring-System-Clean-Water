"use client";
import { useAuth } from "../Context/authContext";
import Frame from "../components/UserPage/Frame";

export default function UserPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Frame />
      {/* Tambahkan tombol logout jika diperlukan */}
      {/* <button onClick={logout} className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button> */}
    </div>
  );
}