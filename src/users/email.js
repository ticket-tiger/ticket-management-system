import nodemailer from 'nodemailer';

// Test account name: Delphine Waters

export const sendOneTimePasswordByEmail = async (email, password) => {
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
    subject: 'You have a new account!',
    text: `Greetings, Your one-time password is: ${password}.  Please login as soon as you can as this
    password will expire in 7 days.`,
    html: `<p>Greetings,</br>Your one-time password is: <b>${password}</b>.  Please login as soon as you can as this
    password will expire in 7 days.`,
  });

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};

export const sendStatusUpdateByEmail = async (email, ticketTitle, oldStatus, newStatus) => {
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
    subject: 'Your ticket\'s status has changed!',
    text: `Greetings, Your ticket entitled '${ticketTitle}' has a status update.  It changed from ${oldStatus} to ${newStatus}!`,
    html: `<p>Greetings,</br>Your ticket entitled <b>'${ticketTitle}'</b> has a status update.  It changed from ${oldStatus} to ${newStatus}!`,
  });

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};
