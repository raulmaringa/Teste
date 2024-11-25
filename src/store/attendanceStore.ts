import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import { Attendance, Comment, DashboardSummary } from '../types';

interface AttendanceState {
  attendances: Attendance[];
  selectedAttendance: Attendance | null;
  dashboardSummary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetchAttendances: () => Promise<void>;
  fetchAttendanceById: (id: string) => Promise<void>;
  createAttendance: (attendance: Partial<Attendance>) => Promise<void>;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
  fetchDashboardSummary: () => Promise<void>;
  addComment: (attendanceId: string, comment: string) => Promise<void>;
  fetchComments: (attendanceId: string) => Promise<Comment[]>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendances: [],
  selectedAttendance: null,
  dashboardSummary: null,
  loading: false,
  error: null,

  fetchAttendances: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('attendances')
        .select('*, customer:customers(*), attendant:users(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ attendances: data as Attendance[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAttendanceById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('attendances')
        .select('*, customer:customers(*), attendant:users(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedAttendance: data as Attendance, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createAttendance: async (attendance: Partial<Attendance>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('attendances')
        .insert([attendance])
        .select()
        .single();

      if (error) throw error;
      const { attendances } = get();
      set({
        attendances: [...attendances, data as Attendance],
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateAttendance: async (id: string, attendance: Partial<Attendance>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('attendances')
        .update(attendance)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const { attendances } = get();
      set({
        attendances: attendances.map(a => a.id === id ? { ...a, ...data } : a),
        selectedAttendance: data as Attendance,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteAttendance: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('attendances')
        .delete()
        .eq('id', id);

      if (error) throw error;
      const { attendances } = get();
      set({
        attendances: attendances.filter(a => a.id !== id),
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchDashboardSummary: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch total counts
      const { data: totalData, error: totalError } = await supabase
        .from('attendances')
        .select('status', { count: 'exact' });

      if (totalError) throw totalError;

      // Fetch counts by status
      const { data: statusData, error: statusError } = await supabase
        .from('attendances')
        .select('status')
        .in('status', ['pending', 'in_progress', 'completed']);

      if (statusError) throw statusError;

      // Fetch recent attendances
      const { data: recentData, error: recentError } = await supabase
        .from('attendances')
        .select('*, customer:customers(*), attendant:users(*)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      const summary: DashboardSummary = {
        total_attendances: totalData?.length || 0,
        pending_attendances: statusData?.filter(a => a.status === 'pending').length || 0,
        in_progress_attendances: statusData?.filter(a => a.status === 'in_progress').length || 0,
        completed_attendances: statusData?.filter(a => a.status === 'completed').length || 0,
        recent_attendances: recentData as Attendance[]
      };

      set({ dashboardSummary: summary, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addComment: async (attendanceId: string, comment: string) => {
    set({ loading: true, error: null });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert([{
          attendance_id: attendanceId,
          author_id: userData.user.id,
          comment
        }]);

      if (error) throw error;
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchComments: async (attendanceId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, author:users(*)')
        .eq('attendance_id', attendanceId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Comment[];
    } catch (error: any) {
      set({ error: error.message });
      return [];
    }
  }
}));
