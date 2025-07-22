const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function insertAdminDirect() {
  try {
    console.log('Inserting admin user with admin client...');
    
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: 'admin@example.com',
        password: '$2a$12$fLcWYe2u9pm2OpAte.qinuuBb9Yykmpd4cM3pHVGzDGwa3N5qCVG2',
        name: 'Admin User',
        role: 'admin'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting admin:', error);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', data.email);
    console.log('👤 Name:', data.name);
    console.log('🔑 Role:', data.role);

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

insertAdminDirect(); 