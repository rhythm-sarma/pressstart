import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("registrations");
  const { blobs } = await store.list();

  const registrations = [];
  for (const blob of blobs) {
    const data = await store.get(blob.key, { type: "json" });
    if (data) registrations.push(data);
  }

  // Sort newest first
  registrations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return new Response(JSON.stringify(registrations), {
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  path: "/api/registrations",
};
