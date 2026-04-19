import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const OpenAI = (await import("openai")).default;
    const { postType, topic, subreddits, targetKarma } = await req.json();
    const fields = Object.entries({ postType, topic, subreddits, targetKarma })
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const prompt = `You are a Reddit expert. Generate an optimized Reddit post based on:

${fields}

Format output as:
1. **Subreddit Recommendations** (top 3 subreddits + why each fits)
2. **Post Title** (Reddit-optimized — curiosity-driven, no clickbait, 80-300 chars)
3. **Post Body** (structured for engagement: hook, story/data, question/discussion prompt)
4. **Flair Suggestion** (recommended post flair for each subreddit)
5. **Engagement Tips** (how to respond to comments, optimal posting time, crosspost strategy)

Rules:
- Post type: ${postType || "Story / Experience"}
- Reddit communities value authenticity, specificity, and vulnerability
- No promotional language
- Title should be specific: include numbers, specific details, real outcomes
- Target: ${targetKarma || "500+ upvotes"}`;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
