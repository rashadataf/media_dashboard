import mongodb from "mongodb";
import { connectToDatabase } from "../../../util/mongodb";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const {
        query: { id },
      } = req;
      const { client, db } = await connectToDatabase();
      const arBlog = await db.collection("blogs").findOne({ arTitle: id });
      if (arBlog) {
        return res.status(200).send(arBlog);
      } else {
        const blog = await db.collection("blogs").findOne({ title: id });
        if (blog) {
          return res.status(200).send(blog);
        } else {
          return res.status(404).send({ message: "blog was not found!" });
        }
      }
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}

export default allowCors(handler);
