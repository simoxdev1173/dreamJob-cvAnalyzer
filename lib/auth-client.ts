import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** 
   * Base URL of your API routes. 
   * - In local dev: http://localhost:3000
   * - In production (Heroku): https://your-heroku-app-name.herokuapp.com
   */
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-heroku-app-name.herokuapp.com"
      : "http://localhost:3000",

  /** Optional: if your API routes are not under /api/auth, set full path */
  // baseURL: "http://localhost:3000/custom-path/auth"
});
