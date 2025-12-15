// lib/supabase.ts

// Polyfills（JSCで URL/crypto を提供）※一番上
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oeahmpmigszggnkyiivq.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYWhtcG1pZ3N6Z2dua3lpaXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzMyMjEsImV4cCI6MjA3MjE0OTIyMX0.1I_1nBmQVjWMM2U0tH9KxwPT4YjIiNm-ewEspLonBR8';

declare global {
  // eslint-disable-next-line no-var
  var __SUPABASE__: SupabaseClient | undefined;
}

const createSupabase = (): SupabaseClient =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // RNでは必須
    },
  });

export const supabase: SupabaseClient =
  globalThis.__SUPABASE__ ?? createSupabase();

if (__DEV__) {
  globalThis.__SUPABASE__ = supabase;
}

export default supabase;

