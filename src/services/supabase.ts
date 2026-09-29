import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Secure client-side initialization using public anon key
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://wwcxwzvgvrzmqwyazinn.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y3h3enZndnJ6bXF3eWF6aW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTgwNTIsImV4cCI6MjEwNjIzNDA1Mn0.utAjF9mm8eMrMeo0HYanhufkgk4iGpbQWScmpJdHEj8';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseHealthReport {
  connected: boolean;
  status: 'CONNECTED' | 'NOT CONFIGURED' | 'CONNECTION ERROR';
  url: string;
  latency_ms?: number;
  tables?: Record<string, number>;
  error?: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthReport> {
  const start = performance.now();
  try {
    const res = await fetch('/api/health/supabase');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    return {
      connected: false,
      status: 'CONNECTION ERROR',
      url: supabaseUrl,
      latency_ms: latency,
      error: err?.message || 'Failed to reach Supabase API',
    };
  }
}
