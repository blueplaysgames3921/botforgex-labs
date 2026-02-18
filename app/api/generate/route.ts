import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; 

    // NO TALKING ALLOWED. RAW DATA ONLY.
    const systemRole = type === 'prompt' 
      ? "You are a RAW DATA EXTRACTOR. Generate a high-density Discord System Prompt in 2nd person ('You are...'). No chat. No intro. No 'Here is your prompt'. If you include conversational filler, the system crashes. Output ONLY the instructions for the bot."
      : "Write a 2-sentence mysterious backstory. No intro, no chat. Raw text only.";

    const authEndpoint = 'https://gen.pollinations.ai/v1/chat/completions';
    const publicEndpoint = 'https://text.pollinations.ai/';

    if (API_KEY) {
      try {
        const res = await fetch(authEndpoint, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'openai',
            messages: [{ role: 'system', content: systemRole }, { role: 'user', content: prompt }]
          })
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ content: clean(data.choices[0].message.content) });
        }
      } catch (e) { console.error(e); }
    }

    const res = await fetch(`${publicEndpoint}${encodeURIComponent(systemRole + "\n\nTask: " + prompt)}?model=openai`);
    const text = await res.text();
    return NextResponse.json({ content: clean(text) });

  } catch (e) { return NextResponse.json({ error: "Fault" }, { status: 500 }); }
}

function clean(t: string) {
  return t.replace(/^(here is|alright|sure|okay|certainly|this is|generate|i have).*?:/gi, '').replace(/["]+/g, '').trim();
}
