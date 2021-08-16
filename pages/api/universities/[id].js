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

      const university = await db
        .collection("universities")
        .findOne({ _id: id });
      if (university) {
        const category = university.category;
        const returnedCategory = await db
          .collection("categories")
          .findOne({ _id: category });
        university.category = returnedCategory;
        return res.status(200).send(university);
      } else {
        return res.status(404).send({ message: "university was not found!" });
      }
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}

export default allowCors(handler);
