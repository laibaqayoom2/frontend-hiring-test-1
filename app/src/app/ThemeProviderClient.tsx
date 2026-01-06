'use client';

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: 'Avenir, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 400 },
    h6: { fontWeight: 400 },
    subtitle1: { fontWeight: 400 },
    subtitle2: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 500 },
    button: { fontWeight: 700 },
  },

  palette: {
    primary: {
      main: '#4f46f8',
    },
    secondary: {
      main: '#ffffffff',
    },
  },
});

export default function ThemeProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f7fa',
        }}
      >
        {children}
      </Box>

    </ThemeProvider>
  );
}
