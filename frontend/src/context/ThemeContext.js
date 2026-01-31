import React, { createContext, useContext } from 'react';

const theme = {
  mode: 'dark',
  gradient: ['#0c0c14', '#13131f', '#16162a'],
  gradientAuth: ['#1a1a2e', '#16213e', '#0f3460'],
  gradientList: ['#0f0f23', '#1a1a3e', '#16213e'],
  gradientDetail: ['#1a1a2e', '#16213e'],
  bg: '#0c0c14',
  surface: 'rgba(255,255,255,0.04)',
  surfaceAlt: 'rgba(255,255,255,0.06)',
  surfaceMuted: 'rgba(255,255,255,0.03)',
  cardBg: 'rgba(255,255,255,0.06)',
  inputBg: 'rgba(255,255,255,0.08)',
  text: '#fff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textHint: '#8892b0',
  accent: '#e94560',
  accentMuted: 'rgba(233, 69, 96, 0.3)',
  accentLight: '#fca5a5',
  accentGradient: ['#e94560', '#ff6b6b'],
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.06)',
  menuBg: '#0c0c14',
  dialogBg: '#1e1e2e',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
