import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
    // let testAccount = await nodemailer.createTestAccount();
    // console.log(testAccount);

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "pugx3dv5infczvm2@ethereal.email",
            pass: "8eVdkHhhQ2PWbXfBHC",
        },
    });

    let info = await transporter.sendMail({
        from: "bob",
        to: to,
        subject: "Change password",
        html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}