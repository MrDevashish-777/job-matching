import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}
export default connectDB;