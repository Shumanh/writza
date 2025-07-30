import mongoose from 'mongoose';

let cached = global._mongo;
if (!cached) {
  cached = global._mongo = { conn: null, promise: null };
}

export async function connectToDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in environment variables.");
    throw new Error("Missing MONGODB_URI");
  }

  if (cached.conn) {
    console.log("Reusing cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      maxPoolSize: 10,
    }).then((mongoose) => {
      console.log("✅ New MongoDB connection established");
      cached.conn = mongoose;
      return mongoose;
    });
  }

  try {
    const connection = await cached.promise;
    return connection;
  } catch (e) {
    console.error("❌ Failed to connect to MongoDB:", e);
    cached.promise = null; // clear the bad promise
    throw e;
  }
}

// Keep the old function for backward compatibility
export async function main() {
  return connectToDB();
}
