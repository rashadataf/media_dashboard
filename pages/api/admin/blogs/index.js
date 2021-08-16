import { connectToDatabase } from "../../../../util/mongodb";
import nextConnect from "next-connect";
import multer from "multer";

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
  try {
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    let title = req.body.title;
    let arTitle = req.body.arTitle;
    let categories = JSON.parse(req.body.categories);
    let description = req.body.description;
    let arDescription = req.body.arDescription;
    const { client, db } = await connectToDatabase();
    const blogs = db.collection("blogs");
    const result = blogs.insertOne({
      title,
      arTitle,
      description,
      arDescription,
      imageUrl,
      categories,
    });
    res.send(true);
  } catch (error) {}
});

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
