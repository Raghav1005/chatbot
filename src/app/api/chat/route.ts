export const maxDuration = 30;

import OpenAI from "openai";
import { connectToDatabase } from "@/lib/mongodb";
import { Chat } from "@/lib/models/chat";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

function getOpenAIClientForModel(_model: string) {
  // Only one global API key is used for the supported models in this app
  return openai;
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// GET – Fetch user chat history
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const model = searchParams.get("model") || undefined;

    if (!userId) return jsonResponse({ ok: false, error: "Missing userId" }, 400);

  await connectToDatabase();
  console.log(`🔎 Looking up chat for userId=${userId} model=${model}`);
  const chat = await Chat.findOne({ userId, model });
  console.log("🔎 Chat lookup result:", !!chat);

    return jsonResponse({ ok: true, messages: chat ? chat.messages : [] });
  } catch (err: any) {
    console.error("❌ Error fetching chat history:", err);
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

// POST – Send message and get AI response
export async function POST(req: Request) {
  try {
  const { userId, messages, model = "openai/gpt-oss-20b:free" } = await req.json();

    if (!process.env.OPENROUTER_API_KEY)
      return jsonResponse({ error: "Missing OPENROUTER_API_KEY" }, 500);
    if (!userId) return jsonResponse({ error: "Missing userId" }, 400);

  await connectToDatabase();
  console.log(`🔎 (POST) Looking up chat for userId=${userId} model=${model}`);

    const normalizedMessages = messages
      .map((msg: any) => ({
        role: msg.role,
        content:
          msg.parts?.map((p: any) => p.text).join(" ").trim() || "",
      }))
      .filter((msg: any) => msg.content.length > 0);

    if (!normalizedMessages.length)
      return jsonResponse({ error: "No valid messages to send" }, 400);

    // Persist user messages immediately so history remains even if the model call fails
    let chat = await Chat.findOne({ userId, model });
    if (!chat) {
      console.log("➕ Creating new chat document for user", userId, "model", model);
      chat = new Chat({ userId, model, messages: [] });
    } else {
      console.log("✳️ Found existing chat, messages count:", chat.messages?.length ?? 0);
    }

    chat.messages.push(...normalizedMessages);
    await chat.save();
    console.log("💾 Saved user messages, total messages:", chat.messages.length);

    // Now call external model; if it fails return the saved chat
    try {
      const client = getOpenAIClientForModel(model);
      const completion = await client.chat.completions.create({
        model,
        messages: normalizedMessages,
      });

      const assistantMessage = completion.choices[0].message;

      chat.messages.push({
        role: assistantMessage.role,
        content: assistantMessage.content,
      });

      await chat.save();
      console.log("💾 Saved assistant response, total messages:", chat.messages.length);

      return jsonResponse({ ok: true, message: assistantMessage, messages: chat.messages });
    } catch (err: any) {
      console.error("❌ Error calling model, returning saved chat:", err?.message || err);
      return jsonResponse({ ok: false, error: err?.message || "Model call failed", messages: chat.messages }, 500);
    }
  } catch (error: any) {
    console.error("❌ Error in POST /api/chat:", error);
    return jsonResponse({ error: error.message }, 500);
  }
}
