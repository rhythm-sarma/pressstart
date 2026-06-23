import { getStore } from "@netlify/blobs";
import crypto from "crypto";

function verifySignature(rawBody, timestamp, signature, secretKey) {
  const signatureData = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureData)
    .digest("base64");
  return expectedSignature === signature;
}

export default async (req, context) => {
  const rawBody = await req.text();
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");

  // Verify signature in production (always verify when signature is present)
  if (signature && timestamp) {
    const isValid = verifySignature(
      rawBody,
      timestamp,
      signature,
      process.env.CASHFREE_SECRET_KEY
    );
    if (!isValid) {
      console.error("Webhook signature verification failed!");
      return new Response("Invalid signature", { status: 401 });
    }
  }

  // Cashfree webhook payload:
  // { data: { order: { order_id, ... }, payment: { payment_status, ... } } }
  const paymentStatus = body?.data?.payment?.payment_status;
  const orderId = body?.data?.order?.order_id;

  if (orderId) {
    const store = getStore("registrations");
    const registration = await store.get(orderId, { type: "json" });

    if (registration) {
      if (paymentStatus === "SUCCESS") {
        registration.status = "SUCCESS";
        console.log(`✅ Payment successful for order ${orderId}`);
        
        // Push to Google Sheets for Valorant registrations
        if (registration.game === 'valorant' && registration.valorantData) {
          const vData = registration.valorantData;
          const sheetData = {
            Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            OrderId: orderId,
            Status: "SUCCESS",
            TeamName: vData.teamName || "",
            City: vData.city || "",
            CaptainName: vData.captainName || "",
            CaptainEmail: vData.captainEmail || "",
            CaptainPhone: vData.captainPhone || "",
            CaptainWhatsApp: vData.captainWhatsApp || "",
            Player2: vData.player2 || "",
            Player3: vData.player3 || "",
            Player4: vData.player4 || "",
            Player5: vData.player5 || "",
            Player6: vData.player6 || "",
            AdditionalInfo: vData.additionalInfo || ""
          };
          
          try {
            await fetch("https://script.google.com/macros/s/AKfycbx_yRn4PMqBAr4omDg_W0HlwdiJcTwCS8v6rebO-m732suMzUeNrezR1dqtbQpGoltL/exec", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(sheetData)
            });
            console.log(`✅ Google Sheet updated for order ${orderId}`);
          } catch (e) {
            console.error("Failed to send to Google Sheets:", e);
          }
        }
        
      } else if (paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED") {
        registration.status = "FAILED";
        console.log(`❌ Payment ${paymentStatus} for order ${orderId}`);
      }
      await store.setJSON(orderId, registration);
    }
  }

  // Always respond 200 so Cashfree doesn't retry
  return new Response("OK", { status: 200 });
};

export const config = {
  path: "/api/webhook",
};
