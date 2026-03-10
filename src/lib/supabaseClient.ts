import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fgvhztvubfhsjgwaqphq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndmh6dHZ1YmZoc2pnd2FxcGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTUwOTcsImV4cCI6MjA4ODczMTA5N30.BxXwHlAoC4vQPR-ezXGUKwrKR6rz0e0_i884t2Ywm-8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
