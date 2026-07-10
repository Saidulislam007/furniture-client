import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI;

// 1. Strict Environment Validation (Standard Rule)
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable inside configuration.");
}

// 2. Prevent Multiple MongoClient Connections in Next.js Development (Global Caching)
const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
};

let client: MongoClient;

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(uri);
} else {
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri);
  }
  client = globalForMongo._mongoClient;
}

// 3. Target Specific Database Instance
const db = client.db("furniture-server");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: client, // Transactions এনাবল রাখার জন্য ক্লায়েন্ট পাস করা হলো
  }),
  // প্রজেক্টের পরবর্তী ধাপে ইমেল/পাসওয়ার্ড বা ওঅথ প্রোভাইডার এখানে যুক্ত হবে
  emailAndPassword: {
    enabled: true,
  },
});