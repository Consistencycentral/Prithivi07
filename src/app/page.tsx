'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/');
    } else {
      router.push('/login/');
    }
  }, [isAuthenticated, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary, #0f172a)',
      color: 'var(--text-primary, #f1f5f9)',
      flexDirection: 'column',
      gap: 16,
    }}>
      <img
        src="/h-logo.png"
        alt="HabitArc Logo"
        width={48}
        height={48}
        style={{
          borderRadius: 12,
          objectFit: 'cover',
        }}
      />
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>HabitArc</div>
      <div style={{
        width: 24,
        height: 24,
        border: '3px solid rgba(99,102,241,0.3)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
