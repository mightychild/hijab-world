// backend/test-paystack.js
require('dotenv').config();

console.log('🧪 Testing Paystack Configuration\n');

console.log('1. Checking environment variables:');
console.log('   PAYSTACK_SECRET_KEY:', process.env.PAYSTACK_SECRET_KEY ? '✅ Set' : '❌ Missing');

if (process.env.PAYSTACK_SECRET_KEY) {
  console.log('   Key starts with:', process.env.PAYSTACK_SECRET_KEY.substring(0, 10));
  console.log('   Key looks like:', process.env.PAYSTACK_SECRET_KEY.startsWith('sk_test_') ? '✅ Test Key' : '❌ Unknown format');
}

console.log('\n2. Testing Paystack module:');
try {
  const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY || 'sk_test_dummy');
  console.log('   ✅ Paystack module loaded successfully');
} catch (error) {
  console.log('   ❌ Paystack module error:', error.message);
}

console.log('\n🎉 Paystack test completed');