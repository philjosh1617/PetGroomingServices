import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const migrateProfileImages = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Find users without profile images (empty string, null, or undefined)
    const usersWithoutImage = await User.find({ 
      $or: [
        { profileImage: "" },
        { profileImage: null },
        { profileImage: { $exists: false } }
      ]
    });

    console.log(`\n📊 Found ${usersWithoutImage.length} users without profile images\n`);

    if (usersWithoutImage.length === 0) {
      console.log('✅ All users already have profile images!');
      await mongoose.disconnect();
      process.exit(0);
    }

    let updated = 0;

    for (const user of usersWithoutImage) {
      // Generate dicebear avatar based on username
      const newProfileImage = `https://api.dicebear.com/9.x/croodles/png?seed=${user.username}&size=200`;

      
      user.profileImage = newProfileImage;
      await user.save();
      
      updated++;
      console.log(`✅ Updated: ${user.username} → ${newProfileImage}`);
    }

    console.log(`\n🎉 Migration complete! Updated ${updated} users.`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run migration
migrateProfileImages();