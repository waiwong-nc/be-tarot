import nodemailer from "nodemailer";

 const sendEmail = (
  recipientEmail: string,
  subject: string,
  body: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAILUSER,
      pass: process.env.GMAILPW,
    },
  });

  return transporter.sendMail({
    from: '"Over React Team" <overreacttest@gmail.com>', // sender address
    to: recipientEmail, // list of receivers
    subject: subject, // Subject line
    html: body, // html body
  });
};

export default sendEmail;


