const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const createTransporter = () => {
    console.log('Creating email transporter...');
    console.log('SMTP Email:', process.env.SMTP_EMAIL);
    console.log('SMTP Password set:', process.env.SMTP_PASSWORD ? 'Yes' : 'No');

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
};

// Send booking confirmation to guest
const sendGuestConfirmation = async (bookingDetails) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Mantralayam Lodges" <${process.env.SMTP_EMAIL}>`,
            to: bookingDetails.email,
            subject: `🙏 Booking Confirmed - ${bookingDetails.lodgeName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 20px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; text-align: center;">🙏 Booking Confirmed!</h1>
                    </div>
                    
                    <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 16px; color: #374151;">Dear <strong>${bookingDetails.guestName}</strong>,</p>
                        
                        <p style="color: #6b7280;">Your booking at <strong>${bookingDetails.lodgeName}</strong> has been confirmed.</p>
                        
                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin: 0 0 15px 0; color: #1f2937;">Booking Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Booking ID:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.bookingId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Room:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.roomName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Check-in:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.checkIn}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Check-out:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.checkOut}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Guests:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.guests}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Amount Paid:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #16a34a;">₹${bookingDetails.amount}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Payment ID:</td>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.paymentId || 'N/A'}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #92400e; font-size: 14px;">
                                <strong>📍 Check-in Time:</strong> 12:00 PM | <strong>Check-out Time:</strong> 11:00 AM<br>
                                Please carry a valid ID proof (Aadhar/Passport/DL).
                            </p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            For any queries, contact us at: <strong>${process.env.SMTP_EMAIL}</strong>
                        </p>
                        
                        <p style="color: #f97316; font-size: 16px; text-align: center; margin-top: 30px;">
                            🙏 Wishing you a blessed spiritual journey! 🙏
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Guest confirmation email sent to:', bookingDetails.email);
        return true;
    } catch (error) {
        console.error('Error sending guest confirmation email:', error);
        return false;
    }
};

// Send notification to Lodge Admin
const sendAdminNotification = async (bookingDetails) => {
    try {
        const transporter = createTransporter();

        // Use lodge admin email if available, otherwise use default admin email
        const adminEmail = bookingDetails.lodgeAdminEmail || process.env.ADMIN_EMAIL;

        const mailOptions = {
            from: `"Mantralayam Lodges System" <${process.env.SMTP_EMAIL}>`,
            to: adminEmail,
            subject: `🔔 New Booking - ${bookingDetails.lodgeName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 20px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; text-align: center;">🔔 New Booking Received!</h1>
                    </div>
                    
                    <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p style="margin: 0; color: #16a34a; font-weight: bold; font-size: 18px;">
                                💵 Payment: ₹${bookingDetails.amount} - PAID
                            </p>
                        </div>
                        
                        <h3 style="color: #1f2937; margin-bottom: 15px;">Guest Information</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Name:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.guestName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.email || 'N/A'}</td>
                            </tr>
                        </table>
                        
                        <h3 style="color: #1f2937; margin-bottom: 15px;">Booking Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Booking ID:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.bookingId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Lodge:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.lodgeName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Room:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.roomName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Check-in:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.checkIn}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Check-out:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.checkOut}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Guests:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.guests}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Payment ID:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${bookingDetails.paymentId || 'N/A'}</td>
                            </tr>
                        </table>
                        
                        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
                            This is an automated notification from Mantralayam Lodges Booking System
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Admin notification email sent to:', adminEmail);
        return true;
    } catch (error) {
        console.error('Error sending admin notification email:', error);
        return false;
    }
};

// Send both emails
const sendBookingEmails = async (bookingDetails) => {
    const results = await Promise.all([
        sendGuestConfirmation(bookingDetails),
        sendAdminNotification(bookingDetails)
    ]);

    return {
        guestEmailSent: results[0],
        adminEmailSent: results[1]
    };
};

module.exports = {
    sendGuestConfirmation,
    sendAdminNotification,
    sendBookingEmails
};
