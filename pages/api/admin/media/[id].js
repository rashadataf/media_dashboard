import { getSession } from "next-auth/client";
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

const uploadMiddleware = upload.array("images", 10);

apiRoute.use(uploadMiddleware);

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    let images = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        images.push(req.files[i].path);
      }
    }
    let title = req.body.title;
    let arTitle = req.body.arTitle;

    let oldImages = JSON.parse(req.body.oldImages);

    const media = db.collection("media");
    const updatedMedia = await media.findOne({
      _id: new mongodb.ObjectID(id),
    });
    if (oldImages.length === 0) {
      if (updatedMedia) {
        const imagesToDelete = updatedMedia.images;
        if (imagesToDelete && imagesToDelete.length > 0) {
          for (let i = 0; i < imagesToDelete.length; i++) {
            let image = imagesToDelete[i];
            if (image && image !== "null") {
              fs.unlinkSync(path.join(process.cwd(), image));
            }
          }
        }
      }
    } else {
      const imagesToDelete = updatedMedia.images;
      if (imagesToDelete && imagesToDelete.length > 0) {
        if (imagesToDelete.length !== oldImages.length) {
          for (let i = 0; i < imagesToDelete.length; i++) {
            let image = imagesToDelete[i];
            if (image && image !== "null") {
              if (!oldImages.find((oldImage) => oldImage === image))
                fs.unlinkSync(path.join(process.cwd(), image));
            }
          }
        }
      }
    }
    images = images.concat(oldImages);

    const result = await media.updateOne(
      { _id: new mongodb.ObjectID(id) },
      {
        $set: {
          title,
          arTitle,
          images,
        },
      }
    );
    res.send(true);
  } catch (error) {}
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
    const deletedBlog = await db
      .collection("media")
      .findOneAndDelete({ _id: new mongodb.ObjectID(id) });
    let images = deletedBlog.value.images;
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        let image = images[i];
        if (image && image !== "null") {
          fs.unlinkSync(path.join(process.cwd(), image));
        }
      }
    }
    res.send(true);
  } catch (error) {
    console.log(error);
  }
});
