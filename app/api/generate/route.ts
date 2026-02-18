import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; 

    // System instruction specifically designed to stop monologues and "design a bot" filler
    const systemRole = type === 'prompt' 
      ? "You are a specialized character architect. Generate a DEEP, high-density system prompt written in the SECOND PERSON ('You are...'). Focus on tone, speaking style, and psychological traits. Do NOT suggest bot features or UI. Do NOT include 'Here is your prompt'. Output ONLY the raw prompt text."
      : "You are a cryptic storyteller. Write a 2-sentence mysterious backstory. No intro, no chat.";

    const authEndpoint = 'https://gen.pollinations.ai/v1/chat/completions';
    const publicEndpoint = 'https://text.pollinations.ai/';

    if (API_KEY) {
      try {
        const res = await fetch(authEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai',
            messages: [
              { role: 'system', content: systemRole },
              { role: 'user', content: prompt }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ content: clean(data.choices[0].message.content) });
        }
      } catch (e) { console.error("Auth Error:", e); }
    }

    // Fallback
    const safePrompt = `${systemRole}\n\nTask: ${prompt}`;
    const res = await fetch(`${publicEndpoint}${encodeURIComponent(safePrompt)}?model=openai`);
    if (res.ok) {
      const text = await res.text();
      return NextResponse.json({ content: clean(text) });
    }

    return NextResponse.json({ error: "Uplink Failed" }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

function clean(t: string) {
  return t.replace(/^(here is|alright|sure|okay|certainly|this is|generate).*?:/gi, '').trim();
}
