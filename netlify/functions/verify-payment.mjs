import { getStore } from "@netlify/blobs";
import crypto from "crypto";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
  
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return new Response(JSON.stringify({ error: "Missing verification fields" }), { status: 400 });
  }

  const signStr = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(signStr)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const store = getStore("registrations");
    const registration = await store.get(razorpay_order_id, { type: "json" });

    if (registration) {
      registration.status = "SUCCESS";
      registration.paymentId = razorpay_payment_id;
      
      console.log(`✅ Payment successful for order ${razorpay_order_id}`);
      
      // Push to Google Sheets for Valorant registrations
      if (registration.game === 'valorant' && registration.valorantData) {
        const vData = registration.valorantData;
        const sheetData = {
          Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          OrderId: razorpay_order_id,
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
          console.log(`✅ Google Sheet updated for order ${razorpay_order_id}`);
        } catch (e) {
          console.error("Failed to send to Google Sheets:", e);
        }
      }

      await store.setJSON(razorpay_order_id, registration);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }
  } else {
    console.error(`❌ Signature mismatch for order ${razorpay_order_id}`);
    return new Response(JSON.stringify({ success: false, error: "Invalid signature" }), { status: 400 });
  }
};

export const config = {
  path: "/api/verify-payment",
};
