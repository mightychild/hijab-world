import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, icon, actions }) => {
  return (
    <Box sx={{ 
      mb: 4, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && (
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
        )}
        <Box>
          <Typography variant="h4" component="h1" gutterBottom={!!subtitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      {actions && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;