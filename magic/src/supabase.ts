import { createClient } from '@supabase/supabase-js';
// Define types for your Supabase tables
export type Json = string | number | boolean | null | {
  [key: string]: Json | undefined;
} | Json[];
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          address: Json | null;
          is_vendor: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          address?: Json | null;
          is_vendor?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          address?: Json | null;
          is_vendor?: boolean;
        };
      };
      tasks: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          priority: 'low' | 'medium' | 'high';
          location: string | null;
          location_contact_name: string | null;
          location_contact_phone: string | null;
          notes: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          creator_id: string;
          assignee_id: string | null;
          visibility: 'public' | 'private';
          budget: number | null;
          required_skills: string[] | null;
          applications_deadline: string | null;
          user_type_filter: 'human' | 'ai' | 'all';
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          location?: string | null;
          location_contact_name?: string | null;
          location_contact_phone?: string | null;
          notes?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          creator_id: string;
          assignee_id?: string | null;
          visibility?: 'public' | 'private';
          budget?: number | null;
          required_skills?: string[] | null;
          applications_deadline?: string | null;
          user_type_filter?: 'human' | 'ai' | 'all';
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          location?: string | null;
          location_contact_name?: string | null;
          location_contact_phone?: string | null;
          notes?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          creator_id?: string;
          assignee_id?: string | null;
          visibility?: 'public' | 'private';
          budget?: number | null;
          required_skills?: string[] | null;
          applications_deadline?: string | null;
          user_type_filter?: 'human' | 'ai' | 'all';
        };
      };
      task_attachments: {
        Row: {
          id: string;
          created_at: string;
          task_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          uploaded_by: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          task_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          uploaded_by: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          task_id?: string;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          uploaded_by?: string;
        };
      };
      vendor_profiles: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          bio: string | null;
          skills: string[] | null;
          hourly_rate: number | null;
          rating: number | null;
          is_ai: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          bio?: string | null;
          skills?: string[] | null;
          hourly_rate?: number | null;
          rating?: number | null;
          is_ai?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          bio?: string | null;
          skills?: string[] | null;
          hourly_rate?: number | null;
          rating?: number | null;
          is_ai?: boolean;
        };
      };
      invoices: {
        Row: {
          id: string;
          created_at: string;
          invoice_number: string;
          issue_date: string;
          due_date: string;
          client_id: string;
          vendor_id: string;
          subtotal: number;
          service_fee: number;
          service_fee_percentage: number;
          total: number;
          notes: string | null;
          terms: string | null;
          status: 'pending' | 'paid' | 'overdue' | 'cancelled';
          payment_date: string | null;
          payment_method: string | null;
          task_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          invoice_number: string;
          issue_date: string;
          due_date: string;
          client_id: string;
          vendor_id: string;
          subtotal: number;
          service_fee: number;
          service_fee_percentage: number;
          total: number;
          notes?: string | null;
          terms?: string | null;
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          payment_date?: string | null;
          payment_method?: string | null;
          task_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          invoice_number?: string;
          issue_date?: string;
          due_date?: string;
          client_id?: string;
          vendor_id?: string;
          subtotal?: number;
          service_fee?: number;
          service_fee_percentage?: number;
          total?: number;
          notes?: string | null;
          terms?: string | null;
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          payment_date?: string | null;
          payment_method?: string | null;
          task_id?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          created_at: string;
          invoice_id: string;
          description: string;
          quantity: number;
          rate: number;
          amount: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          invoice_id: string;
          description: string;
          quantity: number;
          rate: number;
          amount: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          invoice_id?: string;
          description?: string;
          quantity?: number;
          rate?: number;
          amount?: number;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          task_id: string | null;
          title: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          task_id?: string | null;
          title?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          task_id?: string | null;
          title?: string | null;
        };
      };
      conversation_participants: {
        Row: {
          id: string;
          created_at: string;
          conversation_id: string;
          user_id: string;
          last_read: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          conversation_id: string;
          user_id: string;
          last_read?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          conversation_id?: string;
          user_id?: string;
          last_read?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          attachment_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          attachment_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          attachment_url?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          created_at: string;
          task_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          task_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          task_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
        };
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
}
// Create a single supabase client for the entire app
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
// Types for RLS policies
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
// Helper types for common tables
export type User = Tables<'users'>;
export type Task = Tables<'tasks'>;
export type VendorProfile = Tables<'vendor_profiles'>;
export type Invoice = Tables<'invoices'>;
export type Message = Tables<'messages'>;
export type Conversation = Tables<'conversations'>;
export type Review = Tables<'reviews'>;