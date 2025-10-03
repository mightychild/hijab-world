const Paystack = require('paystack');
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

console.log('Paystack configured');
console.log('   Mode:', process.env.PAYSTACK_SECRET_KEY?.startsWith('sk_live_') ? 'Live' : 
                       process.env.PAYSTACK_SECRET_KEY?.startsWith('sk_test_') ? 'Test' : 'Not configured');

// Export the paystack instance directly
module.exports = paystack;