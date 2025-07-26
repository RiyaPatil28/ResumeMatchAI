import mongoose from 'mongoose';

// For MongoDB migration, explicitly use MongoDB URL regardless of PostgreSQL env var
const DATABASE_URL = 'mongodb://localhost:27017/resumematch_db';
console.log('Using MongoDB URL:', DATABASE_URL);

export async function connectToDatabase() {
  try {
    await mongoose.connect(DATABASE_URL, {
      // MongoDB connection options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default mongoose;