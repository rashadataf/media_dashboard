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
  console.log("tam");
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        images.push(req.files[i].path);
      }
    }
    let title = req.body.title;
    let arTitle = req.body.arTitle;
    let establishmentYear = req.body.establishmentYear;
    let state = req.body.selectedState;
    let area = req.body.selectedArea;
    let address = req.body.address;
    let normalPrice = req.body.normalPrice;
    let discountPrice = req.body.discountPrice;
    let localRate = req.body.localRate;
    let internationalRate = req.body.internationalRate;
    let studentsCount = req.body.studentsCount;
    let specializationsCount = req.body.specializationsCount;
    let website = req.body.website;
    let description = req.body.description;
    let arDescription = req.body.arDescription;
    let colleges = JSON.parse(req.body.selectedColleges);
    let specializations = JSON.parse(req.body.selectedSpecializations);
    let scientificDegrees = JSON.parse(req.body.selectedScientificDegrees);
    let programs = JSON.parse(req.body.selectedPrograms);
    let country = req.body.selectedCountry;
    let languages = JSON.parse(req.body.selectedLanguages);
    let oldImages = JSON.parse(req.body.oldImages);

    const universities = db.collection("universities");
    const updatedUniversity = await universities.findOne({
      _id: new mongodb.ObjectID(id),
    });
    if (oldImages.length === 0) {
      if (updatedUniversity) {
        const imagesToDelete = updatedUniversity.images;
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
      const imagesToDelete = updatedUniversity.images;
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

    const result = await universities.updateOne(
      { _id: new mongodb.ObjectID(id) },
      {
        $set: {
          title,
          arTitle,
          description,
          arDescription,
          images,
          establishmentYear,
          state,
          area,
          address,
          normalPrice,
          discountPrice,
          localRate,
          internationalRate,
          studentsCount,
          specializationsCount,
          website,
          colleges,
          specializations,
          scientificDegrees,
          programs,
          country,
          languages,
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
      .collection("universities")
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
