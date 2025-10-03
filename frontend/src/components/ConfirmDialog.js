import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Slide,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getIcon = (type) => {
  switch (type) {
    case 'warning':
      return <WarningIcon sx={{ fontSize: 60, color: '#ff9800' }} />;
    case 'error':
      return <ErrorIcon sx={{ fontSize: 60, color: '#f44336' }} />;
    case 'success':
      return <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />;
    default:
      return <InfoIcon sx={{ fontSize: 60, color: '#2196f3' }} />;
  }
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        background: 'linear-gradient(45deg, #7a3cff 30%, #9d6aff 90%)',
        color: 'white',
        position: 'relative'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          {getIcon(type)}
        </Box>
        
        <Typography variant="body1" sx={{ 
          color: 'text.primary',
          fontSize: '1.1rem',
          lineHeight: 1.6
        }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        justifyContent: 'center',
        gap: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1,
            fontWeight: 'bold',
            borderColor: '#7a3cff',
            color: '#7a3cff',
            '&:hover': {
              bgcolor: 'rgba(122, 60, 255, 0.1)',
              borderColor: '#692fd9',
            }
          }}
        >
          {cancelText}
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          variant="contained"
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1,
            fontWeight: 'bold',
            bgcolor: type === 'error' ? '#f44336' : 
                     type === 'warning' ? '#ff9800' : 
                     type === 'success' ? '#4caf50' : '#7a3cff',
            '&:hover': {
              bgcolor: type === 'error' ? '#d32f2f' : 
                       type === 'warning' ? '#f57c00' : 
                       type === 'success' ? '#388e3c' : '#692fd9',
            },
            minWidth: '100px'
          }}
        >
          {isLoading ? (
            <Box sx={{ 
              width: 20, 
              height: 20, 
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Dialog>
  );
};

export default ConfirmDialog;