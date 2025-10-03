import React from 'react';
import { Box } from '@mui/material';

const ContentContainer = ({ children, maxWidth = '1200px', ...props }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        mx: 'auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ContentContainer;