import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendSms = async ({ to, message }) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log("📩 SMS gönderildi:", sms.sid);
  } catch (error) {
    console.error("❌ SMS gönderilemedi:", error.message);
  }
};
