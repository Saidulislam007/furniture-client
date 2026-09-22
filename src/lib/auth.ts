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

const configuredBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "http://localhost:3000";

const configuredHost = (() => {
  try {
    return new URL(configuredBaseURL).host;
  } catch {
    return undefined;
  }
})();

const allowedHosts = Array.from(
  new Set(
    [
      "localhost:*",
      "127.0.0.1:*",
      configuredHost,
      ...(process.env.BETTER_AUTH_ALLOWED_HOSTS?.split(",") || []),
    ]
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value)),
  ),
);

const trustedOrigins = [
  "http://localhost:*",
  "http://127.0.0.1:*",
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") || []),
]
  .map((value) => value.trim())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL: {
    allowedHosts,
    fallback: configuredBaseURL,
    protocol: "auto",
  },

  trustedOrigins,

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
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});
