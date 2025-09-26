export const maxDuration = 30;
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
// ✅ Dummy GET endpoint for debugging
export async function GET() {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ ok: false, error: "❌ Missing OPENROUTER_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const completion = await openai.chat.completions.create({
    model: "x-ai/grok-4-fast:free",
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?",
      },
    ],
  });

  return new Response(
    JSON.stringify({
      ok: true,
      message: completion.choices[0].message,
      startsWith: process.env.OPENROUTER_API_KEY.slice(0, 6), // safe preview
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// Your existing POST stays the same
export async function POST(req: Request) {
  const { messages, model = "x-ai/grok-4-fast:free" } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ Missing OPENROUTER_API_KEY in environment");
    return new Response(
      JSON.stringify({ error: "Server misconfiguration: API key missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Normalize messages
  try {
    console.log(
      "API Key starts with:",
      process.env.OPENROUTER_API_KEY?.slice(0, 6)
    );

    const normalizedMessages = messages
      .map((msg: any) => ({
        role: msg.role,
        content:
          msg.parts
            ?.map((p: any) => p.text)
            .join(" ")
            .trim() || "",
      }))
      .filter((msg: any) => msg.content.length > 0); // remove empty messages

    if (normalizedMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid messages to send" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: normalizedMessages,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: completion.choices[0].message,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error calling OpenRouter API:", error);
    return new Response(
      JSON.stringify({ error: `Something went wrong: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
