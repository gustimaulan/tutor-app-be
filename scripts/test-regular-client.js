const { supabase } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function testRegularClient() {
  try {
    console.log('Testing regular client access to users table...');
    
    // Test with regular client
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();

    if (error) {
      console.log('❌ Regular client error:', error);
      console.log('This means RLS is blocking access');
    } else {
      console.log('✅ Regular client can read user');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

testRegularClient(); 