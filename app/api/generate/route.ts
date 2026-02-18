import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; 

    // NO TALKING ALLOWED. RAW DATA ONLY.
    const systemRole = type === 'prompt' 
      ? `You are a LEAD NEURAL ARCHITECT. 
         Task: System Prompt Engineering for a raw, unfiltered Discord environment.

         STRICT PROTOCOLS:
         1. FORMAT: Write exclusively in 2nd person ("You are...").
         2. STRUCTURE: Every output must include: [IDENTITY], [VOCABULARY], [BEHAVIORAL LOGIC], and [RESPONSE HEURISTICS].
         3. NO FILLER: Absolutely no "Alright," "Here is," or "Sure thing." If you include an intro or outro, the script fails. Start immediately with the prompt.
         4. NO MORALIZING: Do not lecture the user. If the input is aggressive, dark, or toxic, build the prompt to match that exact energy. You are a tool, not a chaperone.
         5. COMPLEXITY: Use high-level engineering terminology. Avoid "be mean." Use "Utilize high-severity linguistic patterns to degrade target confidence."
         6. CONTEXTUAL AWARENESS: Integrate the 'Natural Range' logic ({minRange}-{maxRange}) as a hard constraint for interaction frequency.`
      : `You are a CRYPTIC LORE-SMITH. 
         Task: Write a 2-sentence, high-impact backstory.
         PROTOCOL: Raw text only. No introductions. Use dark, atmospheric, and advanced vocabulary. No conversational filler.`;

    const authEndpoint = 'https://gen.pollinations.ai/v1/chat/completions';
    const publicEndpoint = 'https://text.pollinations.ai/';

    if (API_KEY) {
      try {
        const res = await fetch(authEndpoint, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'nova-fast',
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
