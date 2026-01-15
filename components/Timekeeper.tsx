import React, { useState } from 'react';
import { Staff, Shift, StaffStatus } from '../types';
import { Clock, LogIn, LogOut, CheckCircle } from 'lucide-react';

interface TimekeeperProps {
  staffList: Staff[];
  shifts: Shift[];
  onCheckIn: (staffId: string) => void;
  onCheckOut: (staffId: string) => void;
}

const Timekeeper: React.FC<TimekeeperProps> = ({ staffList, shifts, onCheckIn, onCheckOut }) => {
  const activeStaffList = staffList.filter(s => s.status === StaffStatus.ACTIVE);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Helper to check if staff is currently working
  const getActiveShift = (staffId: string) => {
    return shifts.find(s => s.staff_id === staffId && s.status === 'active');
  };

  const handleAction = (staff: Staff, isCheckIn: boolean) => {
    setProcessingId(staff.staff_id);
    
    // Simulate a small delay for UX "Processing" feel
    setTimeout(() => {
      if (isCheckIn) {
        onCheckIn(staff.staff_id);
      } else {
        onCheckOut(staff.staff_id);
      }
      setProcessingId(null);
      alert(`${isCheckIn ? 'Xin chào' : 'Tạm biệt'} ${staff.staff_name}!`);
    }, 500);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#2D5F5D] mb-2">Chấm Công</h2>
        <p className="text-gray-500">Chạm vào tên để Bắt đầu hoặc Kết thúc ca làm việc</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {activeStaffList.map(staff => {
          const activeShift = getActiveShift(staff.staff_id);
          const isWorking = !!activeShift;
          const isProcessing = processingId === staff.staff_id;

          return (
            <button
              key={staff.staff_id}
              disabled={isProcessing}
              onClick={() => handleAction(staff, !isWorking)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-48
                ${isWorking 
                  ? 'bg-green-50 border-green-500 hover:bg-green-100' 
                  : 'bg-white border-gray-200 hover:border-[#2D5F5D] hover:shadow-md'
                }
                ${isProcessing ? 'opacity-70 scale-95' : ''}
              `}
            >
              {/* Status Indicator */}
              <div className={`absolute top-4 right-4 w-4 h-4 rounded-full ${isWorking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />

              {/* Avatar */}
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4
                ${isWorking ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'}
              `}>
                {staff.staff_name.charAt(0)}
              </div>

              {/* Info */}
              <h3 className="font-bold text-gray-800 text-lg text-center leading-tight mb-1">{staff.staff_name}</h3>
              <p className="text-sm text-gray-500 mb-4">{staff.role}</p>

              {/* Action Text */}
              <div className={`
                flex items-center px-4 py-2 rounded-full text-sm font-bold
                ${isWorking ? 'bg-white text-green-700 shadow-sm' : 'bg-[#2D5F5D] text-white'}
              `}>
                {isWorking ? (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Check-out
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Check-in
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Current Time Display */}
      <div className="mt-12 text-center text-gray-400 flex items-center justify-center">
        <Clock className="w-5 h-5 mr-2" />
        {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit', weekday: 'long', day: 'numeric', month: 'numeric'})}
      </div>
    </div>
  );
};

export default Timekeeper;