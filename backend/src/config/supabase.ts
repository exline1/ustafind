import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  console.warn('Warning: SUPABASE_URL environment variable is not defined.');
}

// Admin client to bypass RLS (used for administrative tasks, automatic rating calculations, etc.)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Default public client (uses Anon key, obeys RLS if no user token is attached)
export const supabaseDefault = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Creates a Supabase client for a specific request.
 * If a user JWT token is provided, the client will execute operations in the context of that user,
 * meaning Supabase Row Level Security (RLS) policies will be enforced.
 */
export function getSupabaseClient(authHeader?: string) {
  if (!authHeader) {
    return supabaseDefault;
  }

  // Extract bearer token
  const token = authHeader.replace('Bearer ', '');
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
