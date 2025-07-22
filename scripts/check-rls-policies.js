const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function checkRLSPolicies() {
  try {
    console.log('Checking RLS policies on users table...');
    
    // Check if RLS is enabled
    const { data: rlsEnabled, error: rlsError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    console.log('RLS check result:', rlsEnabled ? 'Can read' : 'Cannot read');
    if (rlsError) {
      console.log('RLS error:', rlsError);
    }

    // Try to get policies
    const { data: policies, error: policiesError } = await supabaseAdmin
      .rpc('get_policies', { table_name: 'users' })
      .catch(() => ({ data: null, error: 'Function not available' }));

    if (policiesError) {
      console.log('Could not get policies:', policiesError);
    } else {
      console.log('Policies:', policies);
    }

    // Test with regular client
    console.log('\nTesting with regular client...');
    const { data: regularUser, error: regularError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();

    if (regularError) {
      console.log('Regular client error:', regularError);
    } else {
      console.log('Regular client can read user:', !!regularUser);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkRLSPolicies(); 