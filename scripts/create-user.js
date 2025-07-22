const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function createUser() {
  try {
    const userData = {
      email: 'gmaulan47@gmail.com',
      password: 'just4fun', // Change this!
      name: 'Gusti Maulan D.R.S', // Change this!
      role: 'admin' // or 'user', 'tutor'
    };

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      console.log('❌ User already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating user:', error);
      return;
    }

    console.log('✅ User created successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('🆔 ID:', user.id);

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createUser(); 