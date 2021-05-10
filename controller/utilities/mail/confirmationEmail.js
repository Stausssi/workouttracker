// sends a confirmation email to to specified email adress with a link to unlock the user

//imports
const nodemailer = require('nodemailer');
const config = require("./emailConfirmation.config");

exports.sendConfirmationEmail = (user) => {
    const mailOptions = {
        from: config.auth.user,
        to: user.email,
        subject: 'Registration Confirmation',
        html: config.emailContent(user)
    };

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: config.auth
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}