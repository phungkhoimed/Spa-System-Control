import { Role, SalaryType, StaffStatus, ServiceCategory, ShiftType, Staff, ServiceCatalog, Shift, ServiceRecord } from './types';

export const COLORS = {
  primary: '#2D5F5D',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#FAFAFA',
  white: '#FFFFFF'
};

// Mock Data
export const INITIAL_STAFF: Staff[] = [
  {
    staff_id: 's1',
    staff_name: 'Sarah Nguyen',
    role: Role.KTV,
    salary_base: 8000000,
    salary_type: SalaryType.SHIFT,
    phone: '0901234567',
    status: StaffStatus.ACTIVE,
    joined_at: '2023-01-01'
  },
  {
    staff_id: 's2',
    staff_name: 'Jessica Tran',
    role: Role.KTV,
    salary_base: 7500000,
    salary_type: SalaryType.PERCENT,
    phone: '0901234568',
    status: StaffStatus.ACTIVE,
    joined_at: '2023-02-15'
  },
  {
    staff_id: 's3',
    staff_name: 'Mike Le',
    role: Role.KTV,
    salary_base: 6000000,
    salary_type: SalaryType.HOURLY,
    phone: '0901234569',
    status: StaffStatus.ACTIVE,
    joined_at: '2023-03-10'
  },
  {
    staff_id: 's4',
    staff_name: 'Tien',
    role: Role.RECEPTION,
    salary_base: 5000000,
    salary_type: SalaryType.SHIFT,
    phone: '0901234570',
    status: StaffStatus.ACTIVE,
    joined_at: '2023-05-01'
  }
];

export const INITIAL_SERVICES: ServiceCatalog[] = [
  { service_id: 'svc1', service_name: 'Massage Body 90p', default_price: 850000, standard_duration: 90, category: ServiceCategory.BODY },
  { service_id: 'svc2', service_name: 'Facial Care 60p', default_price: 650000, standard_duration: 60, category: ServiceCategory.FACE },
  { service_id: 'svc3', service_name: 'Body Premium 120p', default_price: 1200000, standard_duration: 120, category: ServiceCategory.BODY },
  { service_id: 'svc4', service_name: 'Nail Basic 30p', default_price: 300000, standard_duration: 30, category: ServiceCategory.NAIL },
  { service_id: 'svc5', service_name: 'Gội đầu dưỡng sinh', default_price: 150000, standard_duration: 30, category: ServiceCategory.HAIR },
];

// Helper to create dates relative to today
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

const dateStr = (d: Date) => d.toISOString().split('T')[0];
const dateTimeStr = (d: Date, hour: number, min: number) => {
    const newD = new Date(d);
    newD.setHours(hour, min, 0, 0);
    return newD.toISOString();
}

// Fixed dates from data import
const d1 = "2026-01-13";
const d2 = "2026-01-14";

export const INITIAL_SHIFTS: Shift[] = [
  // Existing dynamic shifts
  { shift_id: 'sh1', staff_id: 's1', date: dateStr(today), shift_type: ShiftType.MORNING, check_in_time: dateTimeStr(today, 8, 0), check_out_time: dateTimeStr(today, 17, 0), status: 'active' },
  { shift_id: 'sh2', staff_id: 's1', date: dateStr(yesterday), shift_type: ShiftType.MORNING, check_in_time: dateTimeStr(yesterday, 8, 0), check_out_time: dateTimeStr(yesterday, 17, 0), status: 'completed' },
  { shift_id: 'sh3', staff_id: 's2', date: dateStr(today), shift_type: ShiftType.AFTERNOON, check_in_time: dateTimeStr(today, 13, 0), check_out_time: dateTimeStr(today, 21, 0), status: 'active' },
  { shift_id: 'sh4', staff_id: 's3', date: dateStr(today), shift_type: ShiftType.MORNING, check_in_time: dateTimeStr(today, 9, 0), check_out_time: dateTimeStr(today, 18, 0), status: 'active' },

  // New shifts for imported data (Assuming ~8h shifts for context)
  { shift_id: 'sh_imp_1', staff_id: 's1', date: d1, shift_type: ShiftType.MORNING, check_in_time: `${d1}T08:00:00`, check_out_time: `${d1}T17:00:00`, status: 'completed' },
  { shift_id: 'sh_imp_2', staff_id: 's1', date: d2, shift_type: ShiftType.MORNING, check_in_time: `${d2}T08:00:00`, check_out_time: `${d2}T17:00:00`, status: 'completed' },
  { shift_id: 'sh_imp_3', staff_id: 's3', date: d1, shift_type: ShiftType.MORNING, check_in_time: `${d1}T09:00:00`, check_out_time: `${d1}T18:00:00`, status: 'completed' },
  { shift_id: 'sh_imp_4', staff_id: 's2', date: d2, shift_type: ShiftType.MORNING, check_in_time: `${d2}T08:00:00`, check_out_time: `${d2}T17:00:00`, status: 'completed' },
];

export const INITIAL_RECORDS: ServiceRecord[] = [
  // Existing dynamic records
  { record_id: 'r1', shift_id: 'sh2', staff_id: 's1', service_id: 'svc1', service_name: 'Massage Body 90p', service_price: 850000, service_start_time: dateTimeStr(yesterday, 9, 0), service_end_time: dateTimeStr(yesterday, 10, 30), actual_duration: 90, time_recorded: dateTimeStr(yesterday, 10, 35) },
  { record_id: 'r2', shift_id: 'sh2', staff_id: 's1', service_id: 'svc2', service_name: 'Facial Care 60p', service_price: 650000, service_start_time: dateTimeStr(yesterday, 11, 0), service_end_time: dateTimeStr(yesterday, 12, 10), actual_duration: 70, time_recorded: dateTimeStr(yesterday, 12, 15) },
  { record_id: 'r3', shift_id: 'sh1', staff_id: 's1', service_id: 'svc4', service_name: 'Nail Basic 30p', service_price: 300000, service_start_time: dateTimeStr(today, 8, 30), service_end_time: dateTimeStr(today, 9, 0), actual_duration: 30, time_recorded: dateTimeStr(today, 9, 5) },
  { record_id: 'r4', shift_id: 'sh3', staff_id: 's2', service_id: 'svc3', service_name: 'Body Premium 120p', service_price: 1200000, service_start_time: dateTimeStr(today, 14, 0), service_end_time: dateTimeStr(today, 16, 0), actual_duration: 120, time_recorded: dateTimeStr(today, 16, 5) },
  { record_id: 'r5', shift_id: 'sh4', staff_id: 's3', service_id: 'svc5', service_name: 'Gội đầu dưỡng sinh', service_price: 150000, service_start_time: dateTimeStr(today, 10, 0), service_end_time: dateTimeStr(today, 10, 30), actual_duration: 30, time_recorded: dateTimeStr(today, 10, 35) },

  // Imported Records (2026-01-13 & 2026-01-14)
  { record_id: 'imp1', shift_id: 'sh_imp_1', staff_id: 's1', service_id: 'svc1', service_name: 'Massage Body 90p', service_price: 850000, service_start_time: '2026-01-13T09:00:00', service_end_time: '2026-01-13T10:30:00', actual_duration: 90, time_recorded: '2026-01-13T10:35:00' },
  { record_id: 'imp2', shift_id: 'sh_imp_1', staff_id: 's1', service_id: 'svc2', service_name: 'Facial Care 60p', service_price: 650000, service_start_time: '2026-01-13T11:00:00', service_end_time: '2026-01-13T12:00:00', actual_duration: 60, time_recorded: '2026-01-13T12:05:00' },
  { record_id: 'imp3', shift_id: 'sh_imp_1', staff_id: 's1', service_id: 'svc3', service_name: 'Body Premium 120p', service_price: 1200000, service_start_time: '2026-01-13T14:00:00', service_end_time: '2026-01-13T16:00:00', actual_duration: 120, time_recorded: '2026-01-13T16:05:00' },
  
  { record_id: 'imp4', shift_id: 'sh_imp_2', staff_id: 's1', service_id: 'svc1', service_name: 'Massage Body 90p', service_price: 850000, service_start_time: '2026-01-14T09:15:00', service_end_time: '2026-01-14T10:50:00', actual_duration: 95, time_recorded: '2026-01-14T10:55:00' },
  { record_id: 'imp5', shift_id: 'sh_imp_2', staff_id: 's1', service_id: 'svc4', service_name: 'Nail Basic 30p', service_price: 300000, service_start_time: '2026-01-14T11:30:00', service_end_time: '2026-01-14T12:00:00', actual_duration: 30, time_recorded: '2026-01-14T12:05:00' },

  { record_id: 'imp6', shift_id: 'sh_imp_3', staff_id: 's3', service_id: 'svc1', service_name: 'Massage Body 90p', service_price: 850000, service_start_time: '2026-01-13T10:00:00', service_end_time: '2026-01-13T11:40:00', actual_duration: 100, time_recorded: '2026-01-13T11:45:00' },
  { record_id: 'imp7', shift_id: 'sh_imp_3', staff_id: 's3', service_id: 'svc2', service_name: 'Facial Care 60p', service_price: 650000, service_start_time: '2026-01-13T13:00:00', service_end_time: '2026-01-13T14:15:00', actual_duration: 75, time_recorded: '2026-01-13T14:20:00' },

  { record_id: 'imp8', shift_id: 'sh_imp_4', staff_id: 's2', service_id: 'svc5', service_name: 'Gội đầu dưỡng sinh', service_price: 150000, service_start_time: '2026-01-14T09:00:00', service_end_time: '2026-01-14T09:30:00', actual_duration: 30, time_recorded: '2026-01-14T09:35:00' },
];