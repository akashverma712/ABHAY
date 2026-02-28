require("dotenv").config(); // 🔹 Load environment variables

const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();

// ✅ CORS FIX
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Optional safety check
if (!accountSid || !authToken) {
  console.error("❌ Twilio credentials are missing in .env file");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

const FROM_NUMBER = "+13134975339";
const TO_NUMBER = "+917479676602";

app.post("/send-sos", async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;

    const messageBody = `
🚨 SOS ALERT!
Name: ${name}
Location: https://www.google.com/maps?q=${latitude},${longitude}
`;

    const message = await client.messages.create({
      body: messageBody,
      from: FROM_NUMBER,
      to: TO_NUMBER,
    });

    res.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});