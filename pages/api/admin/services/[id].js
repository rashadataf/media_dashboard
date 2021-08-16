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
    const services = db.collection("services").find({});
    const result = await services.toArray();
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
    const { client, db } = await connectToDatabase();
    const services = db.collection("services");
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = req.body.image;
    }
    let title = req.body.title;
    let arTitle = req.body.arTitle;
    let categories = JSON.parse(req.body.categories);
    let description = req.body.description;
    let arDescription = req.body.arDescription;
    if (imageUrl === "") {
      const oldService = await services.findOne({
        _id: new mongodb.ObjectID(id),
      });
      const oldImage = oldService.imageUrl;
      if (oldImage && oldImage.length > 0 && oldImage !== "null") {
        fs.unlinkSync(path.join(process.cwd(), oldImage));
      }
    }

    const result = await services.updateOne(
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
    const deletedService = await db
      .collection("services")
      .findOneAndDelete({ _id: new mongodb.ObjectID(id) });
    let image = deletedService.value.imageUrl;
    if (image && image.length > 0)
      fs.unlinkSync(path.join(process.cwd(), image));
    res.send(true);
  } catch (error) {
    console.log(error);
  }
});
