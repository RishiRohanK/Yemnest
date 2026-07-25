import twilio from "twilio";

// These will need to be configured in your .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

export async function sendWhatsAppMessage({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  if (!accountSid || !authToken || !twilioWhatsAppNumber) {
    console.error("Twilio credentials are not fully configured.");
    return { success: false, error: "Missing Twilio credentials" };
  }

  const client = twilio(accountSid, authToken);

  // Twilio requires numbers to be prefixed with 'whatsapp:' and in E.164 format (+CountryCodeNumber)
  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to.startsWith("+") ? to : "+91" + to}`; // Assuming +91 as default for India, adjust as needed

  try {
    const message = await client.messages.create({
      body: body,
      from: twilioWhatsAppNumber,
      to: formattedTo,
    });
    
    console.log("WhatsApp message sent successfully. SID:", message.sid);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error };
  }
}
