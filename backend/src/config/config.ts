export const config = {
  jwtSecret: process.env.JWT_SECRET || "fallback_placeholder_not_for_production",
  db: {
    connectionString: process.env.MONGODB_URI || "mongodb://127.0.0.1/WE2"
  }
};