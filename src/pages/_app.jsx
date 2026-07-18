import React, { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme';
import '../styles/globals.css';

// Context to expose theme mode toggler
export const ThemeModeContext = createContext({
  mode: 'light',
  toggleThemeMode: () => {}
});

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState('light');

  // Read saved theme from localStorage on client-side mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'dark' || savedMode === 'light') {
      setMode(savedMode);
    }
  }, []);

  const toggleThemeMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', nextMode);
      return nextMode;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
