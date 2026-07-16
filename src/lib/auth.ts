import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
baseURL: process.env.BETTER_AUTH_URL,
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable inside configuration.");
}

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

const db = client.db("furniture-server");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: client,
  }),

  // 🚀 Better-Auth এর অফিশিয়াল ডিরেক্ট কাস্টম ফিল্ড ম্যাপিং (Advanced স্লাইডিং বাদ)
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user", // ডেটাবেসে নতুন ইউজারের ডিফল্ট রোল হবে 'user'
      },
    },
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

  emailAndPassword: {
    enabled: true,
  },
  
});