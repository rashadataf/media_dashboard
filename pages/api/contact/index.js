import nodemailer from "nodemailer";

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
        const { name, email, subject } = req.body;
        const smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: process.env.RECEIVER_EMAIL,
          subject: "Question",
          html: `
            <h3>Name: ${name}</h3>
            <br />
            <h3>Email: ${email}</h3>
            <br />
            <p>Subject: ${subject}</p>
          `,
        };
        smtpTransport.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
            throw new Error("something went wrong!");
          }
        });

        res.send(true);
      } catch (error) {
        res.status(400).send({ error: "there was an error happened!" + error });
      }
    }
  }
}

export default allowCors(handler);
