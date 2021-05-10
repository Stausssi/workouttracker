// sends a confirmation email to to specified email adress with a link to unlock the user

//imports
const {BACKEND_URL} = require("../misc");

const nodemailer = require('nodemailer');
const config = require("./emailConfirmation.config");

console.log(`${__dirname}/../public/images/logo.jpg`);

exports.sendConfirmationEmail = (user) => {
    const mailOptions = {
        from: config.auth.user,
        to: user.email,
        subject: 'Registration Confirmation',
        html: config.emailContent(user),
        attachements: [
            {
                filename: 'arrow.png',
                path: BACKEND_URL + "/images/arrow.png",
                cid: 'arrow' //same cid value as in the html img src
            },
            {
                filename: 'Logo.png',
                path: BACKEND_URL + "/images/Logo.png",
                cid: 'Logo' //same cid value as in the html img src
            }]
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