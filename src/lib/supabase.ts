import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is actually configured (not just placeholder values)
const isValidUrl = (url: string) => {
    try {
        const u = new URL(url);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
};

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey.length > 20;

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    name: string;
                    profession: string;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    profession: string;
                    avatar_url?: string | null;
                };
                Update: {
                    name?: string;
                    profession?: string;
                    avatar_url?: string | null;
                };
            };
            habits: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    category: string;
                    emoji: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    category: string;
                    emoji: string;
                };
                Update: {
                    name?: string;
                    category?: string;
                    emoji?: string;
                };
            };
            completions: {
                Row: {
                    id: string;
                    user_id: string;
                    habit_id: string;
                    date: string;
                    completed: boolean;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    habit_id: string;
                    date: string;
                    completed: boolean;
                };
                Update: {
                    completed?: boolean;
                };
            };
            weekly_goals: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    target: number;
                    current: number;
                    week_key: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    name: string;
                    target: number;
                    current?: number;
                    week_key: string;
                };
                Update: {
                    current?: number;
                };
            };
            notes: {
                Row: {
                    id: string;
                    user_id: string;
                    month_key: string;
                    content: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    month_key: string;
                    content: string;
                };
                Update: {
                    content?: string;
                };
            };
            milestones: {
                Row: {
                    id: string;
                    user_id: string;
                    date: string;
                    title: string;
                    type: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    date: string;
                    title: string;
                    type: string;
                };
                Update: {
                    title?: string;
                    type?: string;
                };
            };
        };
    };
};
