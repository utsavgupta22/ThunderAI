import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔌 Attempting MongoDB connection...');
    console.log(`   URI: ${process.env.MONGODB_URI?.substring(0, 50)}...`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-codehub', {
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`   Full Error: ${error}`);
    console.error('🔧 Troubleshooting tips:');
    console.error('1. Check your MongoDB Atlas connection string in .env');
    console.error('2. Verify database name is included (ai-codehub)');
    console.error('3. Check IP whitelist in MongoDB Atlas console (needs 0.0.0.0/0)');
    console.error('4. Verify username and password are URL-encoded if needed');
    console.error('5. Ensure cluster is running and accepting connections');
    console.error('6. Check network connectivity to MongoDB Atlas');
    process.exit(1);
  }
};

export default connectDB;
