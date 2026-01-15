export enum Role {
  KTV = "KTV",
  RECEPTION = "Lễ tân",
  MANAGER = "Quản lý"
}

export enum SalaryType {
  SHIFT = "Theo ca",
  HOURLY = "Theo giờ",
  PERCENT = "Theo % doanh thu"
}

export enum StaffStatus {
  ACTIVE = "Đang làm",
  RESIGNED = "Nghỉ việc"
}

export enum ServiceCategory {
  BODY = "Body",
  FACE = "Face",
  HAIR = "Hair",
  NAIL = "Nail"
}

export enum ShiftType {
  MORNING = "Ca sáng",
  AFTERNOON = "Ca chiều",
  EVENING = "Ca tối",
  FREE = "Ca tự do"
}

export interface Staff {
  staff_id: string;
  staff_name: string;
  role: Role;
  salary_base: number;
  salary_type: SalaryType;
  phone: string;
  status: StaffStatus;
  joined_at: string;
}

export interface ServiceCatalog {
  service_id: string;
  service_name: string;
  default_price: number;
  standard_duration: number; // minutes
  category: ServiceCategory;
}

export interface Shift {
  shift_id: string;
  staff_id: string;
  date: string; // ISO Date YYYY-MM-DD
  shift_type: ShiftType;
  check_in_time: string; // ISO DateTime
  check_out_time: string; // ISO DateTime
  status: 'active' | 'completed';
}

export interface ServiceRecord {
  record_id: string;
  shift_id: string; // In a real app, we link to shift. Here we simplify.
  staff_id: string;
  service_id: string;
  service_name: string;
  service_price: number;
  service_start_time: string; // ISO DateTime
  service_end_time: string; // ISO DateTime
  actual_duration: number; // minutes
  time_recorded: string;
}

export interface StaffMetrics {
  staff: Staff;
  totalServiceHours: number;
  totalShiftHours: number;
  utilizationRate: number;
  totalRevenue: number;
  revenuePerServiceHour: number;
  costPerHour: number;
  profitPerHour: number;
  profitMargin: number;
  kpiScore: number;
  classification: string;
  classificationColor: string;
}