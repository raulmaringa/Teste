import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import { Customer } from '../types';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  createCustomer: (customer: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ customers: data as Customer[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCustomerById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedCustomer: data as Customer, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createCustomer: async (customer: Partial<Customer>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (error) throw error;
      const { customers } = get();
      set({
        customers: [...customers, data as Customer],
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateCustomer: async (id: string, customer: Partial<Customer>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const { customers } = get();
      set({
        customers: customers.map(c => c.id === id ? { ...c, ...data } : c),
        selectedCustomer: data as Customer,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteCustomer: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      const { customers } = get();
      set({
        customers: customers.filter(c => c.id !== id),
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
