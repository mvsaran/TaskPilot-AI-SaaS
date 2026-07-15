import { createTheme, alpha } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#6D28D9',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#F43F5E',
      light: '#FB7185',
      dark: '#E11D48',
    },
    background: {
      default: '#0A0E1A',
      paper: '#111827',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em' },
    h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.01em' },
    h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.5rem' },
    h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '1.1rem' },
    h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.95rem' },
    button: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, textTransform: 'none' },
    body1: { fontSize: '0.925rem', lineHeight: 1.6 },
    body2: { fontSize: '0.825rem', lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A0E1A',
          color: '#F8FAFC',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 18px',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.5)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
          transition: 'transform 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(59, 130, 246, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#111827',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0D1224',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        },
      },
    },
  },
});
