const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function checkAdmin() {
  try {
    const email = 'admin@example.com';
    
    console.log('Checking admin user...');
    console.log('Email:', email);

    // Get the admin user using admin client
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('❌ Error fetching admin:', error);
      return;
    }

    if (!user) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('🆔 ID:', user.id);
    console.log('🔐 Password hash:', user.password);
    console.log('📅 Created:', user.created_at);

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkAdmin(); 