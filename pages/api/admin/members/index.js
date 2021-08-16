import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../util/mongodb";
import nextConnect from "next-connect";
import multer from "multer";
import bcryptjs from "bcryptjs";

const fileStorage = multer.diskStorage({
  destination: "images",
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
apiRoute.post(async (req, res) => {
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
  try {
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
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
    let password = req.body.password;
    if (password.length < 6) {
      throw new Error("password should be > 6 characters");
    }
    password = String(password);
    password = await bcryptjs.hash(password, 10);
    const role = "member";
    const status = "active";
    const { client, db } = await connectToDatabase();
    const members = db.collection("members");
    const result = members.insertOne({
      name,
      nationality,
      phone,
      email,
      imageUrl,
      role,
      status,
      password,
    });
    res.send(true);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

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
  try {
    const { client, db } = await connectToDatabase();
    const members = db.collection("members").find({});
    const result = await members.toArray();
    result.forEach((member) => {
      delete member.password;
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: "there was an error happened!" });
  }
});
