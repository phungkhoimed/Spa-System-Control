import { Staff, ServiceRecord, Shift, StaffMetrics } from './types';
import { differenceInMinutes, parseISO } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(amount)
    .replace('₫', 'đ');
};

export const formatTime = (isoString: string): string => {
  const d = new Date(isoString);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (isoString: string): string => {
  const d = new Date(isoString);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const calculateDuration = (start: string, end: string): number => {
  return differenceInMinutes(parseISO(end), parseISO(start));
};

export const calculateStaffMetrics = (
  staff: Staff,
  records: ServiceRecord[],
  shifts: Shift[]
): StaffMetrics => {
  // Filter for this staff
  const staffRecords = records.filter(r => r.staff_id === staff.staff_id);
  const staffShifts = shifts.filter(s => s.staff_id === staff.staff_id);

  // 1. Total Service Hours
  const totalServiceMinutes = staffRecords.reduce((acc, r) => acc + r.actual_duration, 0);
  const totalServiceHours = totalServiceMinutes / 60;

  // 2. Total Shift Hours
  const totalShiftMinutes = staffShifts.reduce((acc, s) => {
    return acc + differenceInMinutes(parseISO(s.check_out_time), parseISO(s.check_in_time));
  }, 0);
  // Avoid division by zero, assume at least 1 shift hour if data missing but services exist
  const safeShiftMinutes = totalShiftMinutes === 0 ? (totalServiceMinutes > 0 ? totalServiceMinutes * 1.2 : 1) : totalShiftMinutes;
  const totalShiftHours = safeShiftMinutes / 60;

  // 3. Utilization Rate
  const utilizationRate = Math.min(100, (totalServiceHours / totalShiftHours) * 100);

  // 4. Total Revenue
  const totalRevenue = staffRecords.reduce((acc, r) => acc + r.service_price, 0);

  // 5. Revenue per Service Hour
  const revenuePerServiceHour = totalServiceHours > 0 ? totalRevenue / totalServiceHours : 0;

  // 6. Cost per Hour (Salary Base / 208 hours standard month)
  const costPerHour = staff.salary_base / 208;

  // 7. Profit per Hour
  const profitPerHour = revenuePerServiceHour - costPerHour;

  // 8. Profit Margin
  // Avoid division by zero
  const profitMargin = revenuePerServiceHour > 0 
    ? (profitPerHour / revenuePerServiceHour) * 100 
    : 0;

  // 9. KPI Score
  // Formula: (utilization_rate * 0.4) + (profit_margin * 0.4) + 20
  // Note: profit_margin can be negative, but let's floor KPI at 0
  const kpiScoreRaw = (utilizationRate * 0.4) + (profitMargin * 0.4) + 20;
  const kpiScore = Math.max(0, Math.min(100, kpiScoreRaw)); // Clamp between 0-100

  // 10. Classification
  let classification = "YẾU";
  let classificationColor = "bg-red-100 text-red-700";

  if (kpiScore >= 70) {
    classification = "XUẤT SẮC";
    classificationColor = "bg-green-100 text-green-700";
  } else if (kpiScore >= 50) {
    classification = "TỐT";
    classificationColor = "bg-yellow-100 text-yellow-700";
  } else if (kpiScore >= 30) {
    classification = "TRUNG BÌNH";
    classificationColor = "bg-orange-100 text-orange-700";
  }

  return {
    staff,
    totalServiceHours,
    totalShiftHours,
    utilizationRate,
    totalRevenue,
    revenuePerServiceHour,
    costPerHour,
    profitPerHour,
    profitMargin,
    kpiScore,
    classification,
    classificationColor
  };
};

export const getWarningStatus = (metrics: StaffMetrics) => {
  const warnings = [];
  if (metrics.utilizationRate < 40) warnings.push('Hiệu suất thấp (<40%)');
  if (metrics.profitMargin < 50) warnings.push('Lợi nhuận thấp (<50%)');
  return warnings;
};