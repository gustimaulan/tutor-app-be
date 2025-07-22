#!/usr/bin/env node

/**
 * Test Environment Variables Script
 * This script helps debug environment variable loading issues
 */

console.log('🔍 Testing environment variables...\n');

// Test different environment file loading
const envFiles = ['.env.production', '.env.local', '.env'];

console.log('📁 Checking environment files:');
envFiles.forEach(file => {
  const fs = require('fs');
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} not found`);
  }
});

console.log('\n🌍 Current NODE_ENV:', process.env.NODE_ENV || 'not set');

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
console.log('📄 Loading from:', envFile);

require('dotenv').config({ path: envFile });

console.log('\n🔑 Checking Supabase environment variables:');

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allPresent = false;
  }
});

console.log('\n📊 Summary:');
if (allPresent) {
  console.log('✅ All required environment variables are present!');
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Check if .env.production file exists');
  console.log('2. Verify the file contains all required variables');
  console.log('3. Make sure NODE_ENV=production is set');
  console.log('4. Check file permissions');
}

// Test Supabase connection
if (allPresent) {
  console.log('\n🔗 Testing Supabase connection...');
  try {
    const { supabase } = require('./config/supabase');
    console.log('✅ Supabase client created successfully');
  } catch (error) {
    console.log('❌ Error creating Supabase client:', error.message);
  }
} 