import { connectToDatabase } from "../../../util/mongodb";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).send(true);
  } else {
    if (req.method === "POST") {
      try {
        const { client, db } = await connectToDatabase();
        const { country, scientificDegree, college, language, priceRange } =
          req.body;
        const searchResult = [];
        const query = {};
        if (country) query.country = country;
        if (scientificDegree)
          query.scientificDegrees = { $in: [scientificDegree] };
        if (college) query.colleges = { $in: [college] };

        if (specializations && specializations.length > 0)
          query.specializations = { $in: JSON.parse(specializations) };
        if (language) query.language = { $in: [language] };
        if (priceRange && priceRange.length > 0) {
          const price = priceRange.split("-");
          query.normalPrice = { $gt: price[0], $lt: price[1] };
        }

        const universities = await db
          .collection("universities")
          .find(query)
          .toArray();

        // if (universities.length > 0) {
        //   for (let i = 0; i < universities.length; i++) {
        //     let university = universities[i];
        //     if (country) {
        //       if (university.country && university.country === country) {
        //         console.log("country");
        //         searchResult.push(university);
        //       }
        //     }
        //     if (scientificDegree) {
        //       if (
        //         university.scientificDegrees &&
        //         university.scientificDegrees.length > 0
        //       ) {
        //         for (let j = 0; j < university.scientificDegrees.length; j++) {
        //           let universityScientificDegree = await db
        //             .collection("scientificDegrees")
        //             .findOne({
        //               _id: new mongodb.ObjectID(university.scientificDegrees[j]),
        //             });
        //           if (
        //             universityScientificDegree &&
        //             universityScientificDegree.title.toLowerCase() ===
        //               scientificDegree.toLowerCase()
        //           ) {
        //             searchResult.push();
        //           }
        //         }
        //       }
        //     }
        //   }
        // }

        // if (university) {
        //   const category = university.category;
        //   const returnedCategory = await db
        //     .collection("categories")
        //     .findOne({ _id: category });
        //   university.category = returnedCategory;
        //   return res.status(200).send(university);
        // } else {
        //   return res.status(404).send({ message: "university was not found!" });
        // }
        res.send(universities);
      } catch (error) {
        res.status(400).send({ error: "there was an error happened!" + error });
      }
    }
  }
}

export default allowCors(handler);
