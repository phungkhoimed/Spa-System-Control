import React, { useState } from 'react';
import { Staff, ServiceCatalog, ServiceRecord, Shift } from '../types';
import { calculateStaffMetrics, formatCurrency } from '../utils';
import { User, Tag, Settings as SettingsIcon, DollarSign, Trash2 } from 'lucide-react';

interface SettingsProps {
  staffList: Staff[];
  serviceList: ServiceCatalog[];
  records: ServiceRecord[];
  shifts: Shift[];
  setStaffList: (staff: Staff[]) => void;
  setServiceList: (services: ServiceCatalog[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ staffList, serviceList, records, shifts, setStaffList, setServiceList }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'services' | 'salary'>('salary');

  const handleDeleteStaff = (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      setStaffList(staffList.filter(s => s.staff_id !== id));
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa dịch vụ này?')) {
      setServiceList(serviceList.filter(s => s.service_id !== id));
    }
  };

  const renderSalaryView = () => {
    const metrics = staffList.map(s => calculateStaffMetrics(s, records, shifts));

    return (
      <div className="space-y-4">
        {metrics.map(m => {
          // Simple commission calc: 10% for demonstration if not specified in type
          const commissionRate = m.staff.salary_type === 'Theo % doanh thu' ? 0.3 : 0.05; 
          const commission = m.totalRevenue * commissionRate;
          const estimatedTotal = m.staff.salary_base + commission;
          const isWarning = estimatedTotal > m.totalRevenue;

          return (
            <div key={m.staff.staff_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{m.staff.staff_name}</h3>
                  <p className="text-xs text-gray-500">{m.staff.role}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${m.classificationColor}`}>
                   KPI: {m.kpiScore.toFixed(0)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Lương cứng</p>
                  <p className="font-medium">{formatCurrency(m.staff.salary_base)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Hoa hồng (Est.)</p>
                  <p className="font-medium text-green-600">+{formatCurrency(commission)}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-700">Thực lĩnh dự kiến</span>
                <span className="font-bold text-[#2D5F5D] text-lg">{formatCurrency(estimatedTotal)}</span>
              </div>
              
              {isWarning && (
                <div className="mt-2 text-xs bg-red-50 text-red-600 p-2 rounded">
                  ⚠️ Lương {'>'} Doanh thu tạo ra ({formatCurrency(m.totalRevenue)})
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pb-24 p-4">
      <h2 className="text-2xl font-bold text-[#2D5F5D] mb-6">Cài Đặt & Quản Lý</h2>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('salary')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'salary' ? 'bg-white text-[#2D5F5D] shadow-sm' : 'text-gray-500'}`}
        >
          Lương & HQ
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'staff' ? 'bg-white text-[#2D5F5D] shadow-sm' : 'text-gray-500'}`}
        >
          Nhân viên
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'services' ? 'bg-white text-[#2D5F5D] shadow-sm' : 'text-gray-500'}`}
        >
          Dịch vụ
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'salary' && renderSalaryView()}
        
        {activeTab === 'staff' && (
          <div className="space-y-3">
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2D5F5D] hover:text-[#2D5F5D] font-medium mb-4">
              + Thêm nhân viên mới
            </button>
            {staffList.map(s => (
              <div key={s.staff_id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                 <div>
                    <h4 className="font-bold">{s.staff_name}</h4>
                    <p className="text-sm text-gray-500">{s.role} • {s.status}</p>
                 </div>
                 <button onClick={() => handleDeleteStaff(s.staff_id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
           <div className="space-y-3">
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2D5F5D] hover:text-[#2D5F5D] font-medium mb-4">
              + Thêm dịch vụ mới
            </button>
            {serviceList.map(s => (
              <div key={s.service_id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                 <div>
                    <h4 className="font-bold">{s.service_name}</h4>
                    <p className="text-sm text-gray-500">{formatCurrency(s.default_price)} • {s.standard_duration} phút</p>
                 </div>
                 <button onClick={() => handleDeleteService(s.service_id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;