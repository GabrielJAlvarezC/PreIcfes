const nodemailer = require('nodemailer');


module.exports = async function sendEmail(options) {
    const transporter = nodemailer.createTransport({
        host: procces.env.EMAIL_HOST,
        port: procces.env.EMAIL_PORT,
        auth: {
          user: procces.env.EMAIL_USERNAME,
          pass: procces.env.EMAIL_PASSWORD
        }
      });
    
    await transporter.sendMail({
        from: 'Gabriel Alvarez <preguntas@cienciapvp.io>',
        to: options.correo,
        subject: options.subject,
        text: options.message
    });
}

