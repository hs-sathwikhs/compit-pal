// Test script to verify environment configuration
require('dotenv').config({ path: '.env.local' });

console.log('🔧 Testing Environment Configuration...\n');

// Check required variables
const requiredVars = [
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'JWT_SECRET',
  'NEXTAUTH_SECRET'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ Missing: ${varName}`);
    allGood = false;
  } else if (value.includes('your_') || value.includes('change-this')) {
    console.log(`⚠️  Warning: ${varName} appears to be a placeholder`);
  } else {
    console.log(`✅ Found: ${varName}`);
  }
});

// Check Upstash URL format
const redisUrl = process.env.KV_REST_API_URL;
if (redisUrl && !redisUrl.startsWith('https://')) {
  console.log('❌ KV_REST_API_URL should start with https://');
  allGood = false;
}

// Check JWT Secret strength
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret && jwtSecret.length < 32) {
  console.log('⚠️  Warning: JWT_SECRET should be at least 32 characters long');
}

console.log('\n📋 Configuration Summary:');
console.log(`Redis URL: ${redisUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`Redis Token: ${process.env.KV_REST_API_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`JWT Secret: ${jwtSecret ? '✅ Set' : '❌ Missing'}`);
console.log(`NextAuth Secret: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);

if (allGood) {
  console.log('\n🎉 Configuration looks good! You can now run: npm run dev');
} else {
  console.log('\n❌ Please fix the configuration issues above before running the app.');
} 