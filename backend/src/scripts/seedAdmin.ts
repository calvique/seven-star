import mongoose from 'mongoose';
import { config } from '../config';
import { User } from '../models';

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'School Administrator';
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  if (password.length < 10) throw new Error('ADMIN_PASSWORD must be at least 10 characters');
  await mongoose.connect(config.mongodb.uri);
  let admin = await User.findOne({ email }).select('+password');
  if (!admin) {
    admin = await User.create({ name, email, password, role: 'admin', isActive: true, isEmailVerified: true });
  } else {
    admin.name = name; admin.role = 'admin'; admin.isActive = true; admin.isEmailVerified = true; admin.password = password; await admin.save();
  }
  console.log(`Admin ready: ${admin.email}`);
  await mongoose.disconnect();
}

main().catch((error) => { console.error(error); process.exit(1); });
