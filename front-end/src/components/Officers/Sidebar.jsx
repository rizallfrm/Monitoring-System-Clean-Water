import { useAuth } from "../../Context/authContext";
export function Sidebar({ activeSection, onSectionChange }) {
  const { logout } = useAuth();

  return (
    <aside className="flex flex-col gap-12 items-start px-7 py-8 w-64 bg-white shadow-lg h-[1440px] max-md:flex-row max-md:justify-between max-md:p-5 max-md:w-full max-md:h-auto max-sm:p-4">
      <header className="flex gap-3 items-center h-14 w-[200px] max-sm:w-auto">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12.2156 0 12.4313 0.046875 12.6281 0.135938L21.4547 3.88125C22.486 4.31719 23.2547 5.33438 23.25 6.5625C23.2266 11.2125 21.3141 19.7203 13.2375 23.5875C12.4547 23.9625 11.5453 23.9625 10.7625 23.5875C2.68596 19.7203 0.773459 11.2125 0.750021 6.5625C0.745334 5.33438 1.51408 4.31719 2.54533 3.88125L11.3766 0.135938C11.5688 0.046875 11.7844 0 12 0ZM12 3.13125V20.85C18.4688 17.7188 20.2078 10.7859 20.25 6.62813L12 3.13125Z" fill="#4F46E5"/>
        </svg>
        <h1 className="text-xl font-bold tracking-wide leading-5 text-gray-900 max-sm:text-lg">
          Dashboard Petugas
        </h1>
      </header>
      <nav className="flex flex-col gap-3 w-[200px] max-md:flex-row max-md:w-auto">
        <button
          className={`flex gap-3 items-center px-3 py-2.5 h-10 rounded-lg cursor-pointer border-none w-[200px] transition hover:bg-indigo-50 max-md:px-4 max-md:py-2 max-md:w-auto max-sm:px-3 max-sm:py-1.5 ${
            activeSection === 'dashboard' ? 'text-indigo-700 font-bold' : 'text-gray-700'
          }`}
          onClick={() => onSectionChange('dashboard')}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={activeSection === 'dashboard' ? '#4338CA' : '#374151'} xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM14 14h7v7h-7v-7z" />
          </svg>
          <span className="text-base max-sm:text-sm">Dashboard</span>
        </button>
        <button
          className={`flex gap-3 items-center px-3 py-2.5 h-10 rounded-lg cursor-pointer border-none w-[200px] transition hover:bg-indigo-50 max-md:px-4 max-md:py-2 max-md:w-auto max-sm:px-3 max-sm:py-1.5 ${
            activeSection === 'reports' ? 'text-indigo-700 font-bold' : 'text-gray-700'
          }`}
          onClick={() => onSectionChange('reports')}
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 0C0.896875 0 0 0.896875 0 2V14C0 15.1031 0.896875 16 2 16H10C11.1031 16 12 15.1031 12 14V5H8C7.44687 5 7 4.55313 7 4V0H2ZM8 0V4H12L8 0ZM3.5 8H8.5C8.775 8 9 8.225 9 8.5C9 8.775 8.775 9 8.5 9H3.5C3.225 9 3 8.775 3 8.5C3 8.225 3.225 8 3.5 8ZM3.5 10H8.5C8.775 10 9 10.225 9 10.5C9 10.775 8.775 11 8.5 11H3.5C3.225 11 3 10.775 3 10.5C3 10.225 3.225 10 3.5 10ZM3.5 12H8.5C8.775 12 9 12.225 9 12.5C9 12.775 8.775 13 8.5 13H3.5C3.225 13 3 12.775 3 12.5C3 12.225 3.225 12 3.5 12Z" fill={activeSection === 'reports' ? '#4338CA' : '#374151'}/>
          </svg>
          <span className="text-base max-sm:text-sm">Laporan</span>
        </button>
        <button
          className={`flex gap-3 items-center px-3 py-2.5 h-10 rounded-lg cursor-pointer border-none w-[200px] transition hover:bg-indigo-50 max-md:px-4 max-md:py-2 max-md:w-auto max-sm:px-3 max-sm:py-1.5 ${
            activeSection === 'actions' ? 'text-indigo-700 font-bold' : 'text-gray-700'
          }`}
          onClick={() => onSectionChange('actions')}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={activeSection === 'actions' ? '#4338CA' : '#374151'} xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 6h6m-6 4h6m-6 4h6M6 6h.01M6 10h.01M6 14h.01M4 4h16v16H4V4z" />
          </svg>
          <span className="text-base max-sm:text-sm">Tindakan</span>
        </button>
        <button
          className="flex gap-3 items-center px-3 py-2.5 h-10 rounded-lg cursor-pointer border-none w-[200px] text-red-600 hover:bg-red-50 transition max-md:px-4 max-md:py-2 max-md:w-auto max-sm:px-3 max-sm:py-1.5"
          onClick={logout} // 🔁 Langsung pakai logout dari context
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 17L21 12L16 7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 4H12C13.1046 4 14 4.89543 14 6V9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 15V18C14 19.1046 13.1046 20 12 20H4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-base max-sm:text-sm">Keluar</span>
        </button>
      </nav>
    </aside>
  );
}
export default Sidebar;
