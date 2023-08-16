import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Transport from "nodemailer-sendinblue-transport";
import sgMail from '@sendgrid/mail'
import { env } from "../../env";

// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (recipient: string, message: string, subject: string, html: string) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'SendinBlue', // no need to set host or port etc.
      auth: {
        user: env.smtp.username,
        pass: env.smtp.password
      }
    });

    transporter.sendMail({
      to: recipient,
      from: env.smtp.sender,
      subject: subject,
      html: message
    })
      .then((res) => console.log("Successfully sent"))
      .catch((err) => console.log("Failed ", err))


    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    console.log(error);
  }
}
export const sendmymailSendGrid = async (req: Request, res: Response) => {
  sgMail.setApiKey('');
  const msg = {
    to: 'zanajaona2404@gmail.com', // Change to your recipient
    from: 'mahafeno2404@gmail.com@gmail.com', // Change to your verified sender
    subject: 'Vous avez des nouveaux inscriptions dans votre site',
    text: 'Bonjour,vous avez des nouveaux clients dans votre site,que vous devez valider',
    html: 'message',
  }
  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
      req.flash('success', 'votre candidature a été soumise')
      return res.redirect('/jobs-for-me')
    })
    .catch((error) => {
      console.error(error)
    })
}

