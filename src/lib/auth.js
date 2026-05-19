import dns from "node:dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dbUri = process.env.MONGODB_URI || "mongodb+srv://MediQueue:7RCEYV0gdmdPHAJK@cluster0.tvp63og.mongodb.net/?appName=Cluster0";
const client = new MongoClient(dbUri);
const db = client.db("mediQueueDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: client
  }),
  secret: process.env.BETTER_AUTH_SECRET || "my_super_secret_key_for_mediqueue_123",
  emailAndPassword: {
    enabled: true 
  },
   baseURL: process.env.BETTER_AUTH_URL, 
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
        }, 
    },
});

export const { GET, POST } = auth;