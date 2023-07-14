import * as nodemailer from "nodemailer";
import endpoint from "../config/endpoints.config";

const sendMail = async (
  reciever: string,
  sender: string,
  message: string,
  subject: any
) => {
  var error;
  const transporter =  nodemailer.createTransport({
    port: 465,
    secure: true,
    host: endpoint.mailerHost,
    auth: {
      user: endpoint.mailUsername,
      pass: endpoint.mailPassword,
    },
  });

  // send mail with defined transport object
   transporter.sendMail(
    {
      from:sender,
      to: reciever,
      subject: subject,

      html: `<p>${message}</p>
      `,
    },

    function (err: any, result: any) {
      error = err;
      if (err) {
        error = err;
        console.log(error)
        throw error
      } else {
        console.log(result)
      }
    }
  );
 
};
export default sendMail;
