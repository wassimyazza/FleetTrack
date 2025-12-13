import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
    const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/fleet-test';
    await mongoose.connect(testDbUri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});