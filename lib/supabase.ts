// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oeahmpmigszggnkyiivq.supabase.co";         // ← あなたのURL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYWhtcG1pZ3N6Z2dua3lpaXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzMyMjEsImV4cCI6MjA3MjE0OTIyMX0.1I_1nBmQVjWMM2U0tH9KxwPT4YjIiNm-ewEspLonBR8";            // ← あなたのanonキー

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
