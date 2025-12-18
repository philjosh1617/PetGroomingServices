import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database\n');

    const users = await User.find({}).select('username email profileImage isAdmin');

    console.log(`📊 Total users: ${users.length}\n`);
    console.log('=' .repeat(80));

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Admin: ${user.isAdmin ? 'YES' : 'NO'}`);
      console.log(`   Profile Image: ${user.profileImage || '(empty)'}`);
      console.log(`   Image Type: ${user.profileImage?.startsWith('http') ? 'URL' : 'relative path'}`);
    });

    console.log('\n' + '='.repeat(80));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkUsers();