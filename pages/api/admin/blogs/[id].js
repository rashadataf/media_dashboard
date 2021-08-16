import mongodb from "mongodb";
import { connectToDatabase } from "../../../../util/mongodb";
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";

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

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};

apiRoute.get(async (req, res) => {
  try {
    const { client, db } = await connectToDatabase();
    const blogs = db.collection("blogs").find({});
    const result = await blogs.toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: "there was an error happened!" });
  }
});

apiRoute.put(async (req, res) => {
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
    let title = req.body.title;
    let arTitle = req.body.arTitle;
    let categories = JSON.parse(req.body.categories);
    let description = req.body.description;
    let arDescription = req.body.arDescription;
    const { client, db } = await connectToDatabase();
    const blogs = db.collection("blogs");

    if (imageUrl === "") {
      const oldBlog = await blogs.findOne({
        _id: new mongodb.ObjectID(id),
      });
      const oldImage = oldBlog.imageUrl;
      if (oldImage && oldImage.length > 0 && oldImage !== "null") {
        fs.unlinkSync(path.join(process.cwd(), oldImage));
      }
    }

    const result = await blogs.updateOne(
      { _id: new mongodb.ObjectID(id) },
      {
        $set: {
          title,
          arTitle,
          description,
          arDescription,
          imageUrl,
          categories,
        },
      }
    );
    res.send(true);
  } catch (error) {}
});

apiRoute.delete(async (req, res) => {
  const {
    query: { id },
  } = req;
  try {
    const { client, db } = await connectToDatabase();
    const deletedBlog = await db
      .collection("blogs")
      .findOneAndDelete({ _id: new mongodb.ObjectID(id) });
    let image = deletedBlog.value.imageUrl;
    if (image && image !== "null") {
      fs.unlinkSync(path.join(process.cwd(), image));
    }
    res.send(true);
  } catch (error) {
    console.log(error);
  }
});
