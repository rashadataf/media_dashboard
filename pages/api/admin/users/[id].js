import { getSession } from "next-auth/client";
import mongodb from "mongodb";
import { connectToDatabase } from "../../../../util/mongodb";
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";
import bcryptjs from "bcryptjs";

const fileStorage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  limits: { fieldSize: 25 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const apiRoute = nextConnect({});

const uploadMiddleware = upload.single("image");

apiRoute.use(uploadMiddleware);

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};

apiRoute.get(async (req, res) => {
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
  } = req;
  try {
    const { client, db } = await connectToDatabase();
    const user = db.collection("users").find({ _id: id });
    delete user.password;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: "there was an error happened!" });
  }
});

apiRoute.put(async (req, res) => {
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
  } = req;
  try {
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      if (req.body.image !== "null") {
        imageUrl = req.body.image;
      }
    }
    const name = req.body.name;
    if (name.length === 0) {
      throw new Error("name can't be empty!");
    }
    const nationality = req.body.nationality;
    const phone = req.body.phone;
    if (phone.length === 0) {
      throw new Error("phone can't be empty!");
    } else {
      if (isNaN(parseInt(phone))) throw new Error("an invalid phone number!");
    }
    const email = req.body.email;
    if (email.length === 0) {
      throw new Error("email can't be empty!");
    } else {
      let emailFilter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      let isEmail = emailFilter.test(email);
      if (!isEmail) {
        throw new Error("an invalid email!");
      }
    }
    const residenceCountry = req.body.residenceCountry;
    const specialization = req.body.specialization;
    const university = req.body.university;

    const status = req.body.status;
    if (status !== "active" || status !== "inactive") {
      throw new Error("an invalid status!");
    }

    let updatedUser = {
      name: name,
      nationality: nationality,
      phone: phone,
      email: email,
      status: status,
      imageUrl: imageUrl,
      residenceCountry,
      specialization,
      university,
    };
    const { client, db } = await connectToDatabase();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new mongodb.ObjectID(id) });
    if (user.imageUrl) {
      if (imageUrl) {
        if (imageUrl !== user.imageUrl) {
          fs.unlinkSync(path.join(process.cwd(), user.imageUrl));
        }
      } else {
        fs.unlinkSync(path.join(process.cwd(), user.imageUrl));
      }
    }
    let password = req.body.password;
    if (password.length > 0) {
      if (password.length < 6) {
        throw new Error("password should be > 6 characters");
      } else {
        password = String(password);
        password = await bcryptjs.hash(password, 10);
        updatedUser.password = password;
      }
    }
    const result = await users.updateOne(
      { _id: new mongodb.ObjectID(id) },
      {
        $set: { ...updatedUser },
      }
    );
    res.send(true);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

apiRoute.delete(async (req, res) => {
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
  } = req;
  try {
    const { client, db } = await connectToDatabase();
    const deletedUser = await db
      .collection("users")
      .findOneAndDelete({ _id: new mongodb.ObjectID(id) });
    let image = deletedUser.value.imageUrl;
    if (image && image !== "null") {
      fs.unlinkSync(path.join(process.cwd(), image));
    }
    res.send(true);
  } catch (error) {
    console.log(error);
  }
});
