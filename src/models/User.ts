import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface User {
  email: string;
  password: string;
  name: string;
}

const userSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// 使用Mongoose 9兼容的方式
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

export default mongoose.models.User || mongoose.model<User>('User', userSchema);