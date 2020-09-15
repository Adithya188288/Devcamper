const nodemailer = require("nodemailer");

module.exports = sendMail = async (options) =>  {
  
  let transporter = nodemailer.createTransport({
    host: process.env.MT_HOST,
    port: process.env.MT_PORT,
    secure: false, 
    auth: {
      user: process.env.MT_USER, 
      pass: process.env.MT_PASS 
    },
  });

  let message = {
    from: `${process.env.FROM_NAME} - <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  }

  // send mail with defined transport object
  let info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
 

} 

