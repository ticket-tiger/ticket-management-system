import nodemailer from 'nodemailer';

// Test account name: Delphine Waters

const sendOneTimePasswordByEmail = async (email, password) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'delphine.waters92@ethereal.email',
      pass: 'zU9n19E7nm8RWaC24B',
    },
  });

  const info = await transporter.sendMail({
    from: 'delphine.waters92@ethereal.email',
    to: `${email}`,
    subject: 'You have a new acount!',
    text: `Greetings, Your one-time password is: ${password}.  Please login as soon as you can as this
    password will expire in 7 days.`,
    html: `<p>Greetings,</br>Your one-time password is: <b>${password}</b>.  Please login as soon as you can as this
    password will expire in 7 days.`,
  });

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};

export default sendOneTimePasswordByEmail;
