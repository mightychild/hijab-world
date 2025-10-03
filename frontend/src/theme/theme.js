import { createTheme } from '@mui/material/styles';
import { fadeIn, pulse, bounce } from '../styles/globalStyles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7a3cff',
      light: '#9d6aff',
      dark: '#692fd9',
    },
    secondary: {
      main: '#f9f7fd',
      light: '#ffffff',
      dark: '#e0d8f0',
    },
    background: {
      default: '#f9f7fd',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #7a3cff 30%, #9d6aff 90%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(122, 60, 255, 0.3)',
          },
        },
        contained: {
          boxShadow: '0 4px 15px rgba(122, 60, 255, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
  animations: {
    fadeIn: `${fadeIn} 0.6s ease-out`,
    pulse: `${pulse} 2s infinite`,
    bounce: `${bounce} 1s ease-in-out`,
  },
});

export default theme;