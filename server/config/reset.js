import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Activity from '../models/Activity.js';

/**
 * Reset database - Deletes all collections and resets to empty state
 * Run with: node config/reset.js
 */
const resetDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('\n⚠️  WARNING: This will delete ALL data from the database!');
    console.log('📊 Current database:', mongoose.connection.name);
    
    // Get counts before deletion
    const userCount = await User.countDocuments();
    const chatCount = await Chat.countDocuments();
    const activityCount = await Activity.countDocuments();
    
    console.log('\n📈 Current data:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Chats: ${chatCount}`);
    console.log(`   Activities: ${activityCount}`);
    
    if (userCount === 0 && chatCount === 0 && activityCount === 0) {
      console.log('\n✨ Database is already empty. Nothing to reset.');
      await mongoose.connection.close();
      console.log('👋 Disconnected from MongoDB');
      process.exit(0);
    }

    console.log('\n🗑️  Deleting all data...');
    
    // Delete all documents from each collection
    const deletedUsers = await User.deleteMany({});
    const deletedChats = await Chat.deleteMany({});
    const deletedActivities = await Activity.deleteMany({});

    console.log('\n✅ Database reset complete!');
    console.log(`   Deleted ${deletedUsers.deletedCount} users`);
    console.log(`   Deleted ${deletedChats.deletedCount} chats`);
    console.log(`   Deleted ${deletedActivities.deletedCount} activities`);
    
    // Verify deletion
    const finalUserCount = await User.countDocuments();
    const finalChatCount = await Chat.countDocuments();
    const finalActivityCount = await Activity.countDocuments();
    
    console.log('\n📊 Final database state:');
    console.log(`   Users: ${finalUserCount}`);
    console.log(`   Chats: ${finalChatCount}`);
    console.log(`   Activities: ${finalActivityCount}`);

    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error resetting database:', error.message);
    process.exit(1);
  }
};

// Run the reset function
resetDatabase();
