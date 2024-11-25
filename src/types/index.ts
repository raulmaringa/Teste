export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'admin' | 'attendant';
  created_at: string;
  updated_at: string;
};

export type Attendance = {
  id: string;
  customer_id: string;
  attendant_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  problem_description: string;
  solution: string | null;
  created_at: string;
  updated_at: string;
  // Campos relacionados
  customer?: Customer;
  attendant?: User;
};

export type Comment = {
  id: string;
  attendance_id: string;
  author_id: string;
  comment: string;
  created_at: string;
  // Campos relacionados
  author?: User;
};

export type DashboardSummary = {
  total_attendances: number;
  pending_attendances: number;
  in_progress_attendances: number;
  completed_attendances: number;
  recent_attendances: Attendance[];
};
