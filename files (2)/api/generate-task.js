import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const taskId = uuidv4();
  await kv.set(taskId, { status: "pending" });

  res.status(200).json({
    taskId,
    verificationPageUrl: `/verify/${taskId}`
  });
}