import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "Malformed request body" });
      return;
    }
  }

  const { taskId } = body || {};
  if (!taskId) {
    res.status(400).json({ error: "Missing taskId" });
    return;
  }

  const data = await kv.get(taskId);
  if (!data || data.status !== "pending") {
    res.status(400).json({ error: "Task not found or not pending" });
    return;
  }

  const accessKey = uuidv4();
  await kv.set(taskId, { status: "completed", key: accessKey }, { ex: 3600 }); // expire in 1 hour

  res.status(200).json({ success: true, key: accessKey });
}