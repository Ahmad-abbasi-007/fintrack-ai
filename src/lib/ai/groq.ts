import "server-only";

const DEFAULT_MODEL = "openai/gpt-oss-120b";

export async function callGroqJson(
  prompt: string,
  temperature = 0.4
): Promise<unknown> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "Return only valid JSON. Do not include markdown or explanations.",
          },
          { role: "user", content: prompt },
        ],
        temperature,
        response_format: { type: "json_object" },
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Groq rejected the API key or model access.");
    }
    if (response.status === 404) {
      throw new Error(
        `Groq model "${model}" was not found. Check GROQ_MODEL and model access.`
      );
    }
    if (response.status === 429) {
      throw new Error("AI limit reached. Please try again in a moment.");
    }
    throw new Error(`AI service error (${response.status})`);
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = result.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned an empty response.");

  const cleaned = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }
}