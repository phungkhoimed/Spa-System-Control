import React from 'react';
import { Staff, ServiceRecord, Shift } from '../types';
import { calculateStaffMetrics } from '../utils';
import { ChevronRight } from 'lucide-react';

interface StaffListProps {
  staffList: Staff[];
  records: ServiceRecord[];
  shifts: Shift[];
  onSelectStaff: (staff: Staff) => void;
}

const StaffList: React.FC<StaffListProps> = ({ staffList, records, shifts, onSelectStaff }) => {
  const metrics = staffList.map(s => calculateStaffMetrics(s, records, shifts))
    .sort((a, b) => b.kpiScore - a.kpiScore);

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold text-[#2D5F5D] mb-6">Chi Tiết Hiệu Suất</h2>
      <div className="space-y-4">
        {metrics.map(m => (
          <button 
            key={m.staff.staff_id} 
            onClick={() => onSelectStaff(m.staff)}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-[#2D5F5D] font-bold text-lg mr-4">
                {m.staff.staff_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{m.staff.staff_name}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.classificationColor}`}>
                    {m.classification}
                  </span>
                  <span className="text-xs text-gray-500">KPI: {m.kpiScore.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-gray-400 w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StaffList;