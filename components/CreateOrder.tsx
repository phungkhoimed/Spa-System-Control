import React, { useState, useEffect } from 'react';
import { Staff, ServiceCatalog, StaffStatus, Shift } from '../types';
import { formatCurrency, calculateDuration } from '../utils';
import { addMinutes, format } from 'date-fns';
import { Save, Clock, User, Tag } from 'lucide-react';

interface CreateOrderProps {
  staffList: Staff[];
  serviceList: ServiceCatalog[];
  onSave: (data: any) => void;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ staffList, serviceList, onSave }) => {
  // Form State
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [price, setPrice] = useState<number>(0);
  
  // Date/Time State
  const now = new Date();
  const [date, setDate] = useState(format(now, 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(now, 'HH:mm'));
  const [endTime, setEndTime] = useState(format(addMinutes(now, 60), 'HH:mm'));

  const activeStaff = staffList.filter(s => s.status === StaffStatus.ACTIVE);

  // Auto-update price and end time when service changes
  useEffect(() => {
    if (selectedServiceId) {
      const service = serviceList.find(s => s.service_id === selectedServiceId);
      if (service) {
        setPrice(service.default_price);
        
        // Calculate new end time based on start time + duration
        if (startTime) {
           const [hours, minutes] = startTime.split(':').map(Number);
           const startDate = new Date();
           startDate.setHours(hours, minutes);
           const endDate = addMinutes(startDate, service.standard_duration);
           setEndTime(format(endDate, 'HH:mm'));
        }
      }
    }
  }, [selectedServiceId, serviceList, startTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !selectedServiceId) return;

    // Construct ISO DateTimes
    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    // Validation
    if (endDateTime <= startDateTime) {
      alert("Giờ kết thúc phải sau giờ bắt đầu!");
      return;
    }

    const duration = calculateDuration(startDateTime, endDateTime);
    const service = serviceList.find(s => s.service_id === selectedServiceId);
    const staff = staffList.find(s => s.staff_id === selectedStaffId);

    const newRecord = {
      record_id: `rec-${Date.now()}`,
      shift_id: `sh-auto-${Date.now()}`, // Auto-generated for demo
      staff_id: selectedStaffId,
      service_id: selectedServiceId,
      service_name: service?.service_name || 'Unknown',
      service_price: price,
      service_start_time: startDateTime,
      service_end_time: endDateTime,
      actual_duration: duration,
      time_recorded: new Date().toISOString()
    };

    onSave(newRecord);
    
    // Reset essential fields
    setSelectedServiceId('');
    setPrice(0);
    alert("Đã lưu dịch vụ thành công!");
  };

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#2D5F5D] mb-6">Ghi Nhận Dịch Vụ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Staff Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <User className="w-4 h-4 mr-1 text-[#2D5F5D]" /> Nhân viên
          </label>
          <select 
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5F5D] outline-none"
            required
          >
            <option value="">-- Chọn nhân viên --</option>
            {activeStaff.map(s => (
              <option key={s.staff_id} value={s.staff_id}>{s.staff_name} ({s.role})</option>
            ))}
          </select>
        </div>

        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Tag className="w-4 h-4 mr-1 text-[#2D5F5D]" /> Dịch vụ
          </label>
          <select 
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5F5D] outline-none"
            required
          >
            <option value="">-- Chọn dịch vụ --</option>
            {serviceList.map(s => (
              <option key={s.service_id} value={s.service_id}>{s.service_name} - {formatCurrency(s.default_price)}</option>
            ))}
          </select>
        </div>

        {/* Price Override */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá thực thu</label>
          <div className="relative">
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-3 pl-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5F5D] outline-none font-bold text-gray-800"
              min="0"
            />
            <span className="absolute right-4 top-3 text-gray-400 text-sm">VND</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {/* Date */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              required
            />
          </div>
           {/* Start Time */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-[#2D5F5D]" /> Bắt đầu
            </label>
            <input 
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              required
            />
          </div>
        </div>

        {/* End Time */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-red-500" /> Kết thúc
            </label>
            <input 
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1 italic">
              *Thời gian thực tế sẽ được tính tự động khi lưu
            </p>
          </div>

        <button 
          type="submit"
          className="w-full bg-[#2D5F5D] hover:bg-[#234d4b] text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all flex justify-center items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          LƯU DỊCH VỤ
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;