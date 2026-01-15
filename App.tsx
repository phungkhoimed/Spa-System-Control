import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CreateOrder from './components/CreateOrder';
import StaffList from './components/StaffList';
import StaffDetail from './components/StaffDetail';
import Settings from './components/Settings';
import Timekeeper from './components/Timekeeper'; // Import Timekeeper
import { INITIAL_STAFF, INITIAL_SERVICES, INITIAL_RECORDS, INITIAL_SHIFTS } from './constants';
import { Staff, ServiceRecord, Shift, ShiftType } from './types';
import { format } from 'date-fns';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App Data State (Acting as Database)
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [serviceList, setServiceList] = useState(INITIAL_SERVICES);
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);
  
  // Navigation State
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const handleSaveRecord = (newRecord: ServiceRecord) => {
    setRecords([newRecord, ...records]);
    setActiveTab('dashboard');
  };

  const handleSelectStaff = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  const handleBackFromDetail = () => {
    setSelectedStaff(null);
  };

  // --- TIMEKEEPER LOGIC ---
  const handleCheckIn = (staffId: string) => {
    const now = new Date();
    const newShift: Shift = {
      shift_id: `shift-${Date.now()}`,
      staff_id: staffId,
      date: format(now, 'yyyy-MM-dd'),
      shift_type: ShiftType.FREE, // Default to Flexible/Free shift
      check_in_time: now.toISOString(),
      check_out_time: now.toISOString(), // Temporary placeholder, will act as "Active" if status is active
      status: 'active'
    };
    setShifts([...shifts, newShift]);
  };

  const handleCheckOut = (staffId: string) => {
    const now = new Date();
    setShifts(shifts.map(s => {
      if (s.staff_id === staffId && s.status === 'active') {
        return {
          ...s,
          check_out_time: now.toISOString(),
          status: 'completed'
        };
      }
      return s;
    }));
  };
  // ------------------------

  const renderContent = () => {
    // If viewing detailed staff profile, override tab content
    if (activeTab === 'performance' && selectedStaff) {
      return (
        <StaffDetail 
          staff={selectedStaff}
          records={records}
          shifts={shifts}
          services={serviceList}
          onBack={handleBackFromDetail}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard staffList={staffList} records={records} shifts={shifts} />;
      case 'timekeeper':
        return (
          <Timekeeper 
            staffList={staffList} 
            shifts={shifts} 
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        );
      case 'performance':
        return <StaffList staffList={staffList} records={records} shifts={shifts} onSelectStaff={handleSelectStaff} />;
      case 'create':
        return <CreateOrder staffList={staffList} serviceList={serviceList} onSave={handleSaveRecord} />;
      case 'settings':
        return (
          <Settings 
            staffList={staffList} 
            serviceList={serviceList} 
            records={records} 
            shifts={shifts}
            setStaffList={setStaffList}
            setServiceList={setServiceList}
          />
        );
      default:
        return <Dashboard staffList={staffList} records={records} shifts={shifts} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSelectedStaff(null); }}>
      {renderContent()}
    </Layout>
  );
};

export default App;