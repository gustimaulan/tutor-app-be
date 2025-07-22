const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function updateAdminPassword() {
  try {
    const email = 'admin@example.com';
    const newPassword = 'admin123';
    
    // Generate new hash
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('Updating admin password...');
    console.log('Email:', email);
    console.log('New hash:', hashedPassword);

    // Update the admin user's password
    const { data: user, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating password:', error);
      return;
    }

    if (!user) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin password updated successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);

    // Verify the password works
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log('🔐 Password verification:', isValid ? '✅ Valid' : '❌ Invalid');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

updateAdminPassword(); 