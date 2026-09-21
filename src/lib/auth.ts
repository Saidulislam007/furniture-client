import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI environment variable inside configuration."
  );
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
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client: client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
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