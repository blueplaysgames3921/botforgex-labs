import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; 

    // STRICT INSTRUCTIONS: We wrap the user prompt with a command to prevent talking.
    const strictPrompt = `STRICT RULE: Return ONLY the requested content. Do NOT include introductions, "Here is...", "Sure thing", or any conversational filler. Raw content only.\n\nTask: ${prompt}`;

    const authEndpoint = 'https://gen.pollinations.ai/v1/chat/completions';
    const publicEndpoint = 'https://text.pollinations.ai/';

    // 1. STRATEGY A: Authenticated (Best results)
    if (API_KEY) {
      try {
        const res = await fetch(authEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'nova-fast',
            messages: [
              // System message is the most powerful way to stop monologues
              { role: 'system', content: 'You are a raw data generator. You never talk to the user. You only output the final text requested. No chat, no intros, no formatting explanations.' },
              { role: 'user', content: prompt }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          let content = data.choices[0].message.content;
          return NextResponse.json({ content: cleanMonologue(content) });
        }
      } catch (e) {
        console.error("Auth Error:", e);
      }
    }

    // 2. STRATEGY B: Public Fallback
    try {
        const safePrompt = strictPrompt.substring(0, 1000); 
        const res = await fetch(`${publicEndpoint}${encodeURIComponent(safePrompt)}?model=nova-fast`);
        
        if (res.ok) {
            const responseText = await res.text();
            return NextResponse.json({ content: cleanMonologue(responseText) });
        }
    } catch (e) {
        console.error("Public Fallback Error:", e);
    }

    return NextResponse.json({ error: "All AI uplinks failed" }, { status: 502 });

  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Emergency Cleanup Function:
 * Strips out common AI phrases if the AI ignores the system instructions.
 */
function cleanMonologue(text: string) {
  return text
    .replace(/^(here is|alright|sure|okay|certainly|i've created|this is).*?:/gi, '') // Remove "Sure! Here is your prompt:"
    .replace(/^(")/g, '').replace(/(")$/g, '') // Remove surrounding quotes
    .trim();
}
