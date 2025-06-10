import nodemailer from "nodemailer";

export const sendBookingEmail = async ({ to, name, date, time, jumlah }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // gunakan sesuai email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Oemah Gerabah" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Konfirmasi Booking Kunjungan",
      html: `
        <h3>Hai ${name},</h3>
        <p>Terima kasih telah booking kunjungan ke <strong>Oemah Gerabah</strong>.</p>
        <p><strong>Detail Booking:</strong></p>
        <ul>
          <li>Tanggal: ${date}</li>
          <li>Jam: ${time}</li>
          <li>Jumlah Orang: ${jumlah}</li>
        </ul>
        <p>Sampai jumpa!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email konfirmasi dikirim ke:", to);
  } catch (err) {
    console.error("Gagal mengirim email:", err);
  }
};
