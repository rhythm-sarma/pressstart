import { getStore } from "@netlify/blobs";
import axios from "axios";

export default async (req, context) => {
  const { orderId } = context.params;

  if (!orderId) {
    return new Response(JSON.stringify({ error: "Missing order ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isProduction = process.env.CASHFREE_ENV === "production";
  const cashfreeBaseUrl = isProduction
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

  try {
    const headers = {
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
    };

    const response = await axios.get(`${cashfreeBaseUrl}/orders/${orderId}`, { headers });
    const orderStatus = response.data.order_status; // PAID, ACTIVE, EXPIRED

    const store = getStore("registrations");
    const registration = await store.get(orderId, { type: "json" });

    if (registration) {
      if (orderStatus === "PAID") {
        registration.status = "SUCCESS";
      } else if (orderStatus === "EXPIRED") {
        registration.status = "FAILED";
      }
      await store.setJSON(orderId, registration);

      return new Response(JSON.stringify({ status: registration.status }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching order status:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to get status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/order-status/:orderId",
};
