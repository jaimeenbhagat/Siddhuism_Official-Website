import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoPromise?: Promise<MongoClient>;
};

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  return uri;
}

export async function getMongoClient() {
  if (!globalForMongo.mongoPromise) {
    const client = new MongoClient(getMongoUri());
    globalForMongo.mongoPromise = client.connect();
  }

  globalForMongo.mongoClient = await globalForMongo.mongoPromise;
  return globalForMongo.mongoClient;
}

export function getMongoDatabaseName() {
  return process.env.MONGODB_DB_NAME || "siddhuism_official";
}
