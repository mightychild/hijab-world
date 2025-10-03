import { keyframes } from '@mui/system';

// Animation keyframes
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -8px, 0); }
  70% { transform: translate3d(0, -4px, 0); }
  90% { transform: translate3d(0, -2px, 0); }
`;

// Global styles
export const globalStyles = {
  // Smooth scrolling
  html: {
    scrollBehavior: 'smooth',
  },
  
  // Custom scrollbar
  '::-webkit-scrollbar': {
    width: '8px',
  },
  '::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '::-webkit-scrollbar-thumb': {
    background: '#7a3cff',
    borderRadius: '4px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: '#692fd9',
  },
};