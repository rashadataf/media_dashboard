import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../util/mongodb";

export default async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  const adminEmail = session.user.email;
  const { client, db } = await connectToDatabase();
  const admins = db.collection("admins");
  const admin = await admins.findOne({ email: adminEmail });
  if (!admin) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (admin.role !== "admin") {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      const { client, db } = await connectToDatabase();
      const colleges = db.collection("colleges").find({});
      const result = await colleges.toArray();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  } else if (req.method === "POST") {
    try {
      const { client, db } = await connectToDatabase();
      const result = db.collection("colleges").insertOne(req.body);
      res.send(true);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}
