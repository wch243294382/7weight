const mongoose = require('mongoose');

// 模拟 Next.js 环境变量加载
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

console.log('Testing MongoDB connection in Next.js context...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// 模拟 connectDB 函数
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('Already connected');
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/7weight');
    isConnected = true;
    console.log('✅ MongoDB connected successfully!');
    
    // 测试用户模型
    const User = require('./src/models/User');
    console.log('Testing User model...');
    
    // 尝试创建一个测试用户
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!');
    
    // 查找测试用户
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('✅ Test user found:', foundUser ? 'Yes' : 'No');
    
    // 删除测试用户
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user deleted successfully!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  }
}

// 运行测试
connectDB();