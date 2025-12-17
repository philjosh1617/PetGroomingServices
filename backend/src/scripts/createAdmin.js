import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Admin credentials (change these as needed)
    const ADMIN_EMAIL = 'admin@happypaws.com';
    const ADMIN_PASSWORD = 'admin123';
    const ADMIN_USERNAME = 'admin';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('isAdmin:', existingAdmin.isAdmin);
      
      // Update to admin if not already
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('✅ Updated user to admin status');
      }
      
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // Will be hashed by the pre-save hook
      isAdmin: true,
      profileImage: 'https://api.dicebear.com/9.x/croodles/svg?seed=admin',
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('==================================');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('Username:', ADMIN_USERNAME);
    console.log('==================================');
    console.log('📱 Login with these credentials to access admin dashboard');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();