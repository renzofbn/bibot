import { MongoClient } from "mongodb";

const MONGO_URL = "mongodb://localhost:27017";

const client = new MongoClient(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.db("bibot");

export default client;

