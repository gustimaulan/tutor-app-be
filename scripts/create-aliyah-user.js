const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');
require('dotenv').config({ path: '.env.local' });

async function createAliyahUser() {
  try {
    const email = 'aliyah@example.com';
    const password = 'aliyah123';
    const name = 'ALIYAH HANUN';
    const role = 'tutor';

    // Generate password hash
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('Creating ALIYAH HANUN user...');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Role:', role);
    console.log('Password hash generated');

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing user:', checkError);
      return;
    }

    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Name:', existingUser.name);
      console.log('🔑 Role:', existingUser.role);
      return;
    }

    // Create new user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: email,
        password: hashedPassword,
        name: name,
        role: role
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating user:', error);
      return;
    }

    console.log('✅ ALIYAH HANUN user created successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('🔐 Login credentials:');
    console.log('   Email: aliyah@example.com');
    console.log('   Password: aliyah123');

    // Verify the password works
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('🔐 Password verification:', isValid ? '✅ Valid' : '❌ Invalid');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createAliyahUser(); 