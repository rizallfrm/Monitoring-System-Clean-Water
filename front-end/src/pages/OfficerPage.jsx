"use client";
import React,  {useState}  from 'react';
import  Sidebar  from '../components/Officers/Sidebar';
import  DashboardSection  from '../components/Officers/DashboardSection';
import  ReportsSection  from '../components/Officers/ReportsSection';
import  ActionsSection  from '../components/Officers/ActionsSection';
import  ActionModal  from '../components/Officers/ActionModal';

export function OfficerPage  () {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showActionModal, setShowActionModal] = useState(false);

  return (
    <div>
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
      />
      <div className="flex bg-slate-50 h-[1440px] w-[1440px] max-md:flex-col max-md:w-full max-md:h-auto">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="px-10 py-8 h-[1440px] w-[1184px] max-md:p-5 max-md:w-full max-sm:p-4">
          {activeSection === 'dashboard' && (
            <DashboardSection />
          )}
          {activeSection === 'reports' && (
            <ReportsSection
              onAddAction={() => setShowActionModal(true)}
            />
          )}
          {activeSection === 'actions' && (
            <ActionsSection />
          )}
        </main>
      </div>
    </div>
  );
}
export default OfficerPage;
