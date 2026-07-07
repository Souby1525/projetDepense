import nodemailer from "nodemailer";

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return {
    sendMail: async (mailOptions) => {
      console.log("[EMAIL LOG] To:", mailOptions.to);
      console.log("[EMAIL LOG] Subject:", mailOptions.subject);
      console.log("[EMAIL LOG] Text:", mailOptions.text);
      if (mailOptions.html) {
        console.log("[EMAIL LOG] HTML:", mailOptions.html);
      }
      return { messageId: "console-fallback" };
    }
  };
};

export const sendVerificationEmail = async (to, link) => {
  const subject = "Verification de votre adresse e-mail";
  const text = `Bonjour,\n\nVeuillez verifier votre adresse e-mail en cliquant sur le lien suivant:\n${link}\n\nCe lien expire dans 24 heures. Si vous n'avez pas demande cela, ignorez ce message.`;
  const html = `
    <p>Bonjour,</p>
    <p>Veuillez verifier votre adresse e-mail en cliquant sur le lien ci-dessous :</p>
    <p><a href="${link}">Verifier mon adresse e-mail</a></p>
    <p>Ce lien expire dans 24 heures.</p>
    <p>Si vous n'avez pas demande cela, ignorez ce message.</p>
  `;

  const transporter = createTransporter();

  return transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@projetdepense.local",
    to,
    subject,
    text,
    html
  });
};
