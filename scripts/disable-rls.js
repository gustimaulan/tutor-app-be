const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function disableRLS() {
  try {
    console.log('Disabling RLS on users table...');
    
    // Disable RLS on users table
    const { error } = await supabaseAdmin.rpc('exec_sql', { 
      sql: 'ALTER TABLE users DISABLE ROW LEVEL SECURITY;' 
    });
    
    if (error) {
      console.log('❌ Error disabling RLS:', error.message);
    } else {
      console.log('✅ RLS disabled on users table');
    }
    
    // Test if it works now
    console.log('\nTesting regular client access...');
    const { supabase } = require('../config/supabase');
    const { data: user, error: testError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();

    if (testError) {
      console.log('❌ Still cannot access:', testError.message);
    } else {
      console.log('✅ Regular client can now access users!');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

disableRLS(); 