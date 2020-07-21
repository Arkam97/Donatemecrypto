const mongoclient = require('mongodb').MongoClient;
const mongostr =  process.env.DB_URI  || require('./monogostr').dbURI;;

export const client = new mongoclient(mongostr,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

export const createConnection = async () => {
  await client.connect();
};
