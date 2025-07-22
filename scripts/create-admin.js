const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  try {
    const adminData = {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    };

    // Check if admin already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminData.email)
      .single();

    if (existingUser) {
      console.log('❌ Admin user already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    
    console.log('Creating admin user...');
    console.log('Email:', adminData.email);
    console.log('Hash:', hashedPassword);

    // Create admin user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email: adminData.email,
          password: hashedPassword,
          name: adminData.name,
          role: adminData.role
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating admin:', error);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('🆔 ID:', user.id);

    // Verify the password works
    const isValid = await bcrypt.compare(adminData.password, hashedPassword);
    console.log('🔐 Password verification:', isValid ? '✅ Valid' : '❌ Invalid');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createAdmin(); 