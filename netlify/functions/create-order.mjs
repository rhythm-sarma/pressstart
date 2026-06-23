import { getStore } from "@netlify/blobs";
import Razorpay from "razorpay";

export default async (req, context) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, phone, game, teamName, teamMembers, volunteerData, valorantData } = await req.json();

  if (!name || !email || !phone || !game) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const PRICING = { valorant: 300, fc26: 100, volunteer: 0 };
  const amount = PRICING[game];

  if (amount === undefined) {
    return new Response(JSON.stringify({ error: "Invalid game selected" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const store = getStore("registrations");

  // Volunteer — free, no payment needed
  if (amount === 0) {
    await store.setJSON(orderId, {
      orderId,
      name,
      email,
      phone,
      game,
      teamName: teamName || "",
      teamMembers: teamMembers || "",
      ...(volunteerData ? { volunteerData } : {}),
      amount: 0,
      status: "SUCCESS",
      createdAt: new Date().toISOString(),
    });

    // Send data to Google Sheets
    const sheetData = {
      Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      Name: name,
      Email: email,
      Phone: phone,
      Age: volunteerData?.age || "",
      Gender: volunteerData?.gender || "",
      City: volunteerData?.city || "",
      Instagram: volunteerData?.instagram || "",
      "Available Full Duration": volunteerData?.availableFullDuration || "",
      "Available Briefing": volunteerData?.availableBriefing || "",
      "Volunteered Before": volunteerData?.volunteeredBefore || "",
      "Previous Events": volunteerData?.previousEvents || "",
      "Other Experiences": volunteerData?.otherExperiences || "",
      "Interested Roles": volunteerData?.interestedRoles?.join(", ") || "",
      "Why Volunteer": volunteerData?.whyVolunteer || "",
      "Emergency Contact": volunteerData?.emergencyContact || "",
      "Followed Instagram": volunteerData?.followedInstagram || "",
      "Followed Twitch": volunteerData?.followedTwitch || ""
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwsDmv7oMJec4C5Ro7lquoLwbdm7oGLyXbaT3FdIyyLO05tZSLaUyra-yg9q4E7Cai3/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sheetData)
      });
    } catch (e) {
      console.error("Failed to send to Google Sheets:", e);
    }

    return new Response(JSON.stringify({ free: true, orderId }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Paid registration — create Razorpay order
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: orderId
    };

    const order = await razorpay.orders.create(options);

    // Save registration as PENDING
    await store.setJSON(order.id, {
      orderId: order.id,
      localOrderId: orderId,
      name,
      email,
      phone,
      game,
      teamName: teamName || "",
      teamMembers: teamMembers || "",
      ...(valorantData ? { valorantData } : {}),
      amount,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create order",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/create-order",
};
