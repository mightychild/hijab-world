import {useState} from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper
} from '@mui/material';
import { Payment } from '@mui/icons-material';

export default function PaymentForm({ onNext, onBack, shippingData }) {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ paymentMethod });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Payment sx={{ mr: 1 }} />
        Payment Method
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel 
              value="card" 
              control={<Radio />} 
              label="Credit/Debit Card (Flutterwave)" 
            />
            <FormControlLabel 
              value="bank" 
              control={<Radio />} 
              label="Bank Transfer" 
            />
            <FormControlLabel 
              value="ussd" 
              control={<Radio />} 
              label="USSD" 
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: '#7a3cff',
            '&:hover': { bgcolor: '#692fd9' }
          }}
        >
          Review Order
        </Button>
      </Box>
    </Box>
  );
}