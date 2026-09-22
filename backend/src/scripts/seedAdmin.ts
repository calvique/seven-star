import mongoose from 'mongoose';
import { config } from '../config';
import { Admin, User } from '../models';

async function main(){
  if(!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD){ throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required'); }
  await mongoose.connect(config.mongodb.uri);
  let user=await User.findOne({email:process.env.ADMIN_EMAIL.toLowerCase()}).select('+password');
  if(!user){ user=await User.create({name:process.env.ADMIN_NAME||'School Administrator',email:process.env.ADMIN_EMAIL.toLowerCase(),password:process.env.ADMIN_PASSWORD,role:'admin',isActive:true,isEmailVerified:true}); }
  else { user.role='admin'; user.isActive=true; user.isEmailVerified=true; user.password=process.env.ADMIN_PASSWORD; await user.save(); }
  const existing=await Admin.findOne({user:user._id});
  if(!existing) await Admin.create({user:user._id,permissions:['*']});
  console.log(`Admin ready: ${user.email}`);
  await mongoose.disconnect();
}
main().catch(async err=>{console.error(err);try{await mongoose.disconnect()}catch{};process.exit(1)});
