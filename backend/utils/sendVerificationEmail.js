const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    serfvice: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, token) => {
    const link  = process.env.CLIENT_URL + '/verify-email/' + token;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email for HamRahi',
        html: `
            <h2>Welcome!</h2>
            <p>Please verify your account.</p>

            <a href="${link}">
                Verify Email
            </a>
        `
    });
};

module.exports = sendVerificationEmail;