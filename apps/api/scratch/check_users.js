import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

import { connectDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';

async function checkUsers() {
  await connectDatabase({ allowDegradedMode: true });
  const count = await User.countDocuments();
  console.log("Total users count in MongoDB:", count);

  const users = await User.find({}).lean();
  console.log("Users in DB:", JSON.stringify(users, null, 2));

  process.exit(0);
}

checkUsers();
