import { MongoClient } from "mongodb";

let db = {};
const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getDB = (dbName) => db[dbName] || connect(dbName);

const connect = async (dbName) => {
  await client.connect();

  db[dbName] = client.db(dbName);

  return db[dbName];
};
