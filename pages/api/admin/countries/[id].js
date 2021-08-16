import { getSession } from "next-auth/client";
import mongodb from "mongodb";
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
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      // Get data from your database
      res.status(200).json({ id, name: `User ${id}` });
      break;
    case "PUT":
      {
        const updates = Object.keys(req.body);
        const allowedUpdates = ["title", "arTitle"];
        const isValidOperation = updates.every((update) =>
          allowedUpdates.includes(update)
        );
        if (!isValidOperation) {
          res.status(404).send({ error: "an Invalid Update" });
        }
        try {
          const { client, db } = await connectToDatabase();
          const result = await db
            .collection("countries")
            .updateOne(
              { _id: new mongodb.ObjectID(id) },
              { $set: { title: req.body.title, arTitle: req.body.arTitle } }
            );
          res.status(200).json({ success: "updated!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
      break;
    case "DELETE":
      {
        try {
          const { client, db } = await connectToDatabase();
          const deleteResult = await db
            .collection("countries")
            .deleteOne({ _id: new mongodb.ObjectID(id) });
          res.status(200).json({ success: "deleted!" });
        } catch (error) {}
      }
      break;
  }
}
