const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your password or App Password
  },
});

const sendReservationEmail = ({ hotel_name, seller_email, room_number, user_phone, check_in_date, check_out_date }) => {
  const mailOptions = {
    from:"",
    to: seller_email,
    subject: "🔔 New Reservation Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50; text-align: center;">Room Reservation Confirmation 📅</h2>
        <p>Dear Hotel Manager,</p>
        <p>A new room reservation has been successfully processed. Below are the reservation details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: #fff;">
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Hotel Name</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${hotel_name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Room Number</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${room_number}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Guest Contact</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${user_phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Check-in Date</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${check_in_date}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Check-out Date</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">${check_out_date}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          Please ensure that the room is prepared for the guest's arrival. If any further verification is required, kindly reach out to the guest using the provided contact details.
        </p>
        <p style="margin-top: 20px; font-style: italic; color: #555;">
          Thank you for choosing our booking system. We appreciate your partnership and look forward to providing seamless service.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />
        <p style="font-size: 14px; color: #888; text-align: center;">
          This is an automated notification. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

const sendCancellationEmail = ({ hotel_name, check_in_date, check_out_date, room_number, user_email }) => {
  const emailContent = `
    <h3>Dear user, your reservation has been cancelled !</h3>
    <table border="1" cellspacing="0" cellpadding="5">
      <tr><td><strong>Hotel Name</strong></td><td>${hotel_name}</td></tr>
      <tr><td><strong>Room Number</strong></td><td>${room_number}</td></tr>
      <tr><td><strong>Check-in Date</strong></td><td>${check_in_date}</td></tr>
      <tr><td><strong>Check-out Date</strong></td><td>${check_out_date}</td></tr>
    </table>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user_email,
    subject: "Reservation Cancellation Notice",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

module.exports = {
  sendReservationEmail,
  sendCancellationEmail,
};