import bcryptjs from "bcryptjs";
import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      const { name, email, password } = data;

      if (name.trim().length === 0) {
        throw new Error("name can't be empty!");
      }

      const { client, db } = await connectToDatabase();

      if (email.trim().length === 0) {
        throw new Error("email can't be empty!");
      } else {
        let emailFilter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        let isEmail = emailFilter.test(email);
        if (!isEmail) {
          throw new Error("an invalid email!");
        }
      }

      if (password.trim().length < 6) {
        throw new Error("password should be > 6 characters");
      }
      let hashedPassword = String(password);
      hashedPassword = await bcryptjs.hash(hashedPassword, 10);
      const result = await db.collection("admins").insertOne({
        name: name,
        email: email,
        password: hashedPassword,
        role: "admin",
      });
      res.status(201).send({ message: "User created!" });
    } catch (error) {
      res.status(422).send({ message: error.message });
    }
  }
}
