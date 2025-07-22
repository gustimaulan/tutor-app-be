const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function testLogin() {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    
    console.log('Testing login functionality...');
    console.log('Email:', email);
    console.log('Password:', password);

    // First, get the user from database
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching user:', fetchError);
      return;
    }

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User found in database');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('🔐 Stored hash:', user.password);

    // Test password comparison
    console.log('\nTesting password comparison...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔐 Password comparison result:', isValidPassword ? '✅ Valid' : '❌ Invalid');

    // Generate a new hash for comparison
    const newHash = await bcrypt.hash(password, 12);
    console.log('🆕 New hash for same password:', newHash);
    
    // Test with new hash
    const isValidNewHash = await bcrypt.compare(password, newHash);
    console.log('🔐 New hash comparison result:', isValidNewHash ? '✅ Valid' : '❌ Invalid');

    // Test if the stored hash works with bcrypt
    console.log('\nTesting stored hash...');
    try {
      const testHash = await bcrypt.hash('test', 12);
      console.log('✅ bcrypt is working correctly');
    } catch (bcryptError) {
      console.error('❌ bcrypt error:', bcryptError);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

testLogin(); 