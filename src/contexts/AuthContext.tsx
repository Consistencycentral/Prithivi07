'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
    name: string;
    profession: string;
    avatar?: string;
    email?: string;
    supabaseId?: string;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    user: UserProfile | null;
    supabaseUser: User | null;
    session: Session | null;
    isLoading: boolean;
    isSupabaseMode: boolean;
    login: (name: string, profession: string, email?: string, password?: string) => Promise<{ error?: string }>;
    signup: (name: string, profession: string, email: string, password: string) => Promise<{ error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    isAuthenticated: false,
    user: null,
    supabaseUser: null,
    session: null,
    isLoading: true,
    isSupabaseMode: false,
    login: async () => ({}),
    signup: async () => ({}),
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isSupabaseMode = isSupabaseConfigured;

    useEffect(() => {
        setMounted(true);

        if (isSupabaseMode && supabase) {
            // Capture in a local const so TypeScript keeps the non-null narrowing
            // inside nested async closures.
            const sb = supabase;

            // ── Supabase auth mode ──
            const initAuth = async () => {
                try {
                    const { data: { session: currentSession } } = await sb.auth.getSession();
                    if (currentSession?.user) {
                        setSession(currentSession);
                        setSupabaseUser(currentSession.user);
                        await loadProfile(currentSession.user.id);
                    }
                } catch (err) {
                    console.error('Auth init error:', err);
                } finally {
                    setIsLoading(false);
                }
            };

            initAuth();

            // Listen for auth state changes
            const { data: { subscription } } = sb.auth.onAuthStateChange(
                async (event, newSession) => {
                    setSession(newSession);
                    setSupabaseUser(newSession?.user ?? null);

                    if (event === 'SIGNED_IN' && newSession?.user) {
                        await loadProfile(newSession.user.id);
                    } else if (event === 'SIGNED_OUT') {
                        setUser(null);
                    }
                }
            );

            return () => subscription.unsubscribe();
        } else {
            // ── localStorage fallback mode ──
            const stored = localStorage.getItem('habitarc-user');
            if (stored) {
                try {
                    setUser(JSON.parse(stored));
                } catch {
                    localStorage.removeItem('habitarc-user');
                }
            }
            setIsLoading(false);
        }
    }, [isSupabaseMode]);

    const loadProfile = async (userId: string) => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('name, profession, avatar_url')
                .eq('id', userId)
                .single();

            if (!error && data) {
                const profile: UserProfile = {
                    name: data.name,
                    profession: data.profession,
                    avatar: data.avatar_url || undefined,
                    supabaseId: userId,
                };
                setUser(profile);
            }
        } catch (err) {
            console.error('Load profile error:', err);
        }
    };

    // ── Login (Supabase or localStorage) ──
    const login = async (name: string, profession: string, email?: string, password?: string): Promise<{ error?: string }> => {
        if (isSupabaseMode && supabase && email && password) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) return { error: error.message };
            if (data.user) {
                await loadProfile(data.user.id);
            }
            return {};
        } else {
            // localStorage mode
            const profile: UserProfile = { name, profession };
            setUser(profile);
            localStorage.setItem('habitarc-user', JSON.stringify(profile));
            return {};
        }
    };

    // ── Signup (Supabase or localStorage) ──
    const signup = async (name: string, profession: string, email: string, password: string): Promise<{ error?: string }> => {
        if (isSupabaseMode && supabase) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, profession },
                },
            });
            if (error) return { error: error.message };
            if (data.user) {
                // Profile auto-created by trigger, but let's also set it locally
                const profile: UserProfile = {
                    name,
                    profession,
                    email,
                    supabaseId: data.user.id,
                };
                setUser(profile);
            }
            return {};
        } else {
            // localStorage mode
            const profile: UserProfile = { name, profession, email };
            setUser(profile);
            localStorage.setItem('habitarc-user', JSON.stringify(profile));
            return {};
        }
    };

    // ── Logout ──
    const logout = async () => {
        if (isSupabaseMode && supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setSupabaseUser(null);
        setSession(null);
        localStorage.removeItem('habitarc-user');
    };

    if (!mounted) return null;

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                supabaseUser,
                session,
                isLoading,
                isSupabaseMode,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
