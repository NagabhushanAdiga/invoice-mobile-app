import React, { createContext, useContext } from 'react';

const theme = {
  mode: 'light',
  gradient: ['#ffffff', '#ffffff', '#ffffff'],
  gradientAuth: ['#ffffff', '#ffffff', '#ffffff'],
  gradientList: ['#ffffff', '#ffffff', '#ffffff'],
  gradientDetail: ['#ffffff', '#ffffff'],
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceAlt: '#ffffff',
  surfaceMuted: '#ffffff',
  cardBg: '#ffffff',
  inputBg: '#ffffff',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textHint: '#94a3b8',
  accent: '#e94560',
  accentMuted: 'rgba(233, 69, 96, 0.15)',
  accentLight: '#e94560',
  accentGradient: ['#e94560', '#ff6b6b'],
  border: 'rgba(0,0,0,0.08)',
  borderLight: 'rgba(0,0,0,0.06)',
  menuBg: '#ffffff',
  dialogBg: '#ffffff',
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
