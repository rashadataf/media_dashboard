import { connectToDatabase } from "../../../util/mongodb";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).send(true);
  } else {
    if (req.method === "POST") {
      try {
        const { client, db } = await connectToDatabase();

        const application = await db
          .collection("applications")
          .insertOne(req.body);

        res.send(application);
      } catch (error) {
        res.status(400).send({ error: "there was an error happened!" + error });
      }
    }
  }
}

export default allowCors(handler);
