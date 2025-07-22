const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function fixRLSPolicies() {
  try {
    console.log('Fixing RLS policies for authentication...');
    
    // Drop existing policies
    console.log('Dropping existing policies...');
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view their own data" ON users;',
      'DROP POLICY IF EXISTS "Users can update their own data" ON users;',
      'DROP POLICY IF EXISTS "Allow all users operations" ON users;'
    ];
    
    for (const policy of dropPolicies) {
      try {
        await supabaseAdmin.rpc('exec_sql', { sql: policy });
        console.log('✅ Dropped policy');
      } catch (error) {
        console.log('⚠️  Could not drop policy (might not exist):', error.message);
      }
    }
    
    // Create new policies that allow authentication
    console.log('Creating new authentication-friendly policies...');
    const newPolicies = [
      'CREATE POLICY "Allow authentication" ON users FOR SELECT USING (true);',
      'CREATE POLICY "Allow registration" ON users FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Allow profile updates" ON users FOR UPDATE USING (true);'
    ];
    
    for (const policy of newPolicies) {
      try {
        await supabaseAdmin.rpc('exec_sql', { sql: policy });
        console.log('✅ Created policy');
      } catch (error) {
        console.log('⚠️  Could not create policy:', error.message);
      }
    }
    
    console.log('✅ RLS policies updated!');
    
    // Test if it works now
    console.log('\nTesting regular client access...');
    const { supabase } = require('../config/supabase');
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();

    if (error) {
      console.log('❌ Still cannot access:', error.message);
    } else {
      console.log('✅ Regular client can now access users!');
      console.log('📧 Email:', user.email);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

fixRLSPolicies(); 