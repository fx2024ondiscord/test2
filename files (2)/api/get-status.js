import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { taskId } = req.query;
  if (!taskId) {
    res.status(400).json({ error: "Missing taskId" });
    return;
  }

  const data = await kv.get(taskId);
  if (!data) {
    res.status(404).json({ status: "pending" });
    return;
  }
  if (data.status === "completed") {
    res.status(200).json({ status: "completed", key: data.key });
  } else {
    res.status(200).json({ status: "pending" });
  }
}