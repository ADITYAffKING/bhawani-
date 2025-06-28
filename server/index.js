// server/index.js


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const twilio = require('twilio');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/send-sms', async (req, res) => {
  const { message, recipient } = req.body;

  try {
    // Send SMS
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: process.env.TO_PHONE,     // reciver no.    // Or make this dynamic BY PASSING A no. in request tab and send the no. in request
    });

    // Send Email
  await sgMail.send({
  to: recipient, // dynamic recipient
  from: process.env.FROM_EMAIL, // now verified
  subject: 'Notification Alert',
  text: message,
  html: `<strong>${message}</strong>`,
});

    res.status(200).json({ message: 'SMS and Email sent successfully!' });
  } catch (error) {
    console.error('❌ Notification Error:', error.response?.body || error.message || error);
    res.status(500).json({ message: 'Failed to send SMS/Email' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
