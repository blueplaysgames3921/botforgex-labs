import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; 

    const systemRole = type === 'prompt' 
      ? `You are a BEHAVIORAL PROFILER. 
         Task: Design a Discord Chatbot System Prompt(in a way, its Personality) based ONLY on the User's provided Persona and Name.

         STRICT PROTOCOLS:
         1. DYNAMIC SCALING: Match the energy of the input. If the persona is "Lazy/Chill," the prompt must be laid-back and low-energy. If the persona is "Aggressive/Dark," the prompt must be intense. Do not default to "creepy" unless requested.
         2. FORMAT: Write in 2nd person ("You are..."). 
         3. SECTIONS: Include [CORE IDENTITY], [TONE], [INTERACTION LOGIC] and [CONSTRAINTS].
         4. NO FILLER: Start immediately with the prompt text. No "Here is the prompt" or conversational intro.
         5. RAW OUTPUT: Do not lecture or filter. If the user wants a degenerate persona, build it. If they want a wholesome one, build it. 
         6. TERMINOLOGY: Use descriptive, technical language but avoid "Abyssal/Void" tropes unless relevant to the specific user input.`
      : `You are a LIFESTYLE WRITER. 
         Task: Write a 2-sentence backstory that directly mirrors the user's hobbies and personality. 
         PROTOCOL: No cryptic bullshit. If they like eating, write about their history with food. No intros. Raw text only. No conversational filler.`;
    
    const authEndpoint = 'https://gen.pollinations.ai/v1/chat/completions';
    const publicEndpoint = 'https://text.pollinations.ai/';

    // 1. Try Anon/Public Endpoint First
    try {
      const publicRes = await fetch(`${publicEndpoint}${encodeURIComponent(systemRole + "\n\nTask: " + prompt)}?model=openai`);
      if (publicRes.ok) {
        const text = await publicRes.text();
        if (text) return NextResponse.json({ content: clean(text) });
      }
    } catch (e) { 
      console.error("Public Endpoint Failed:", e); 
    }

    // 2. Fallback to Auth Gemini-Fast
    if (API_KEY) {
      try {
        const authRes = await fetch(authEndpoint, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gemini-fast',
            messages: [{ role: 'system', content: systemRole }, { role: 'user', content: prompt }]
          })
        });
        if (authRes.ok) {
          const data = await authRes.json();
          return NextResponse.json({ content: clean(data.choices[0].message.content) });
        }
      } catch (e) {
        console.error("Auth Endpoint Failed:", e);
      }
    }

    return NextResponse.json({ error: "All providers failed" }, { status: 502 });

  } catch (e) { 
    return NextResponse.json({ error: "Fault" }, { status: 500 }); 
  }
}

function clean(t: string) {
  return t.replace(/^(here is|alright|sure|okay|certainly|this is|generate|i have).*?:/gi, '').replace(/["]+/g, '').trim();
}
