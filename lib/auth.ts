import { betterAuth } from "better-auth";
import { getPool } from "./db";


    export const auth = betterAuth({
       database: getPool(),
         emailAndPassword: { 
             enabled: true, 
  }, 
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    },
});