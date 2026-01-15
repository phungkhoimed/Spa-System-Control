import React, { useMemo } from 'react';
import { Staff, ServiceRecord, Shift, ServiceCatalog } from '../types';
import { calculateStaffMetrics, formatCurrency, formatDate, formatTime } from '../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Phone, DollarSign, Clock } from 'lucide-react';

interface StaffDetailProps {
  staff: Staff;
  records: ServiceRecord[];
  shifts: Shift[];
  services: ServiceCatalog[];
  onBack: () => void;
}

const StaffDetail: React.FC<StaffDetailProps> = ({ staff, records, shifts, services, onBack }) => {
  const metrics = calculateStaffMetrics(staff, records, shifts);

  // Group records by date for chart
  const dailyData = useMemo(() => {
    const data: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    last7Days.forEach(date => {
      data[date] = 0;
    });

    records
      .filter(r => r.staff_id === staff.staff_id)
      .forEach(r => {
        const date = r.service_start_time.split('T')[0];
        if (data[date] !== undefined) {
          data[date] += r.service_price;
        }
      });

    return Object.entries(data).map(([date, revenue]) => ({
      date: formatDate(date),
      revenue
    }));
  }, [records, staff.staff_id]);

  // Specific Records List
  const staffRecords = records
    .filter(r => r.staff_id === staff.staff_id)
    .sort((a, b) => new Date(b.service_start_time).getTime() - new Date(a.service_start_time).getTime());

  return (
    <div className="pb-20 bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-[#2D5F5D] text-white p-6 rounded-b-3xl shadow-lg relative">
        <button onClick={onBack} className="absolute top-6 left-4 text-white/80 hover:text-white">
          &larr; Quay lại
        </button>
        <div className="mt-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
            {staff.staff_name.charAt(0)}
          </div>
          <h2 className="mt-3 text-2xl font-bold">{staff.staff_name}</h2>
          <p className="text-white/80">{staff.role} • {staff.status}</p>
          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#2D5F5D]`}>
            {metrics.classification} (KPI: {metrics.kpiScore.toFixed(0)})
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Doanh thu tuần</p>
            <p className="text-lg font-bold text-[#2D5F5D]">{formatCurrency(metrics.totalRevenue)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Hiệu dụng</p>
            <p className="text-lg font-bold text-[#2D5F5D]">{metrics.utilizationRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center text-sm text-gray-700">
            <Phone className="w-4 h-4 mr-3 text-gray-400" />
            {staff.phone}
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <DollarSign className="w-4 h-4 mr-3 text-gray-400" />
            Lương: {formatCurrency(staff.salary_base)} ({staff.salary_type})
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-4 h-4 mr-3 text-gray-400" />
            Tham gia: {formatDate(staff.joined_at)}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">Doanh thu 7 ngày qua</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#2D5F5D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service History */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-800 text-sm ml-1">Lịch sử dịch vụ</h3>
          {staffRecords.map(record => {
             const standard = services.find(s => s.service_id === record.service_id)?.standard_duration || 60;
             const isSlow = record.actual_duration > standard * 1.2;

             return (
              <div key={record.record_id} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center border border-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{record.service_name}</div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(record.service_start_time)}
                    <span className="mx-2">•</span>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(record.service_start_time)} - {formatTime(record.service_end_time)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#2D5F5D] text-sm">{formatCurrency(record.service_price)}</div>
                  {isSlow && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">
                      Chậm {record.actual_duration - standard}p
                    </span>
                  )}
                </div>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;