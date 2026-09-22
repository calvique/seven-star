import mongoose,{Document,Schema,Model} from 'mongoose';
export interface IAdmin extends Document { user: mongoose.Types.ObjectId; permissions: string[]; lastLogin?: Date; createdAt: Date; updatedAt: Date; }
const adminSchema=new Schema<IAdmin>({user:{type:Schema.Types.ObjectId,ref:'User',required:true,unique:true},permissions:{type:[String],default:['*']},lastLogin:Date},{timestamps:true});
adminSchema.index({user:1});
export const Admin:Model<IAdmin>=mongoose.model<IAdmin>('Admin',adminSchema);
