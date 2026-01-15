import React from 'react';
import { StaffMetrics, Staff, ServiceRecord, Shift } from '../types';
import { calculateStaffMetrics, formatCurrency, getWarningStatus } from '../utils';
import { AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';

interface DashboardProps {
  staffList: Staff[];
  records: ServiceRecord[];
  shifts: Shift[];
}

const Dashboard: React.FC<DashboardProps> = ({ staffList, records, shifts }) => {
  // Calculate metrics for all staff
  const allStaffMetrics: StaffMetrics[] = staffList.map(staff => 
    calculateStaffMetrics(staff, records, shifts)
  ).sort((a, b) => b.kpiScore - a.kpiScore); // Sort by KPI Desc

  // Calculate Summary Metrics
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.service_start_time.startsWith(today));
  
  const dailyRevenue = todayRecords.reduce((acc, r) => acc + r.service_price, 0);
  const activeStaffCount = shifts.filter(s => s.status === 'active').length;
  const dailyServiceHours = todayRecords.reduce((acc, r) => acc + r.actual_duration, 0) / 60;

  const warnings = allStaffMetrics.filter(m => m.utilizationRate < 40 || m.profitMargin < 50);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#2D5F5D]">Tổng Quan</h2>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('vi-VN')}</span>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <div className="flex items-center mb-2">
            <AlertTriangle className="text-red-500 w-5 h-5 mr-2" />
            <h3 className="font-bold text-red-700">Cảnh báo hiệu suất</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-red-600">
            {warnings.map(w => {
              const causes = getWarningStatus(w);
              return (
                <li key={w.staff.staff_id}>
                  <span className="font-medium">{w.staff.staff_name}:</span> {causes.join(', ')}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Doanh thu hôm nay</p>
            <p className="text-2xl font-bold text-[#2D5F5D]">{formatCurrency(dailyRevenue)}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="text-green-600 w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Nhân viên đang làm</p>
            <p className="text-2xl font-bold text-[#2D5F5D]">{activeStaffCount}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="text-blue-600 w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Giờ dịch vụ (hôm nay)</p>
            <p className="text-2xl font-bold text-[#2D5F5D]">{dailyServiceHours.toFixed(1)}h</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <Clock className="text-orange-600 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Leaderboard - Added whitespace-nowrap and overflow handling for tablet/mobile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Bảng Xếp Hạng Hiệu Suất (Tuần)</h3>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="p-3">Nhân viên</th>
                <th className="p-3 text-right">Hiệu dụng</th>
                <th className="p-3 text-right">Doanh thu</th>
                <th className="p-3 text-center">KPI</th>
                <th className="p-3 text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allStaffMetrics.map((m) => (
                <tr key={m.staff.staff_id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{m.staff.staff_name}</td>
                  <td className="p-3 text-right">{m.utilizationRate.toFixed(0)}%</td>
                  <td className="p-3 text-right">{formatCurrency(m.totalRevenue)}</td>
                  <td className="p-3 text-center font-bold text-[#2D5F5D]">{m.kpiScore.toFixed(0)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.classificationColor}`}>
                      {m.classification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;