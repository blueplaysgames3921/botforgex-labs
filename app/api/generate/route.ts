import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; 

    // NO TALKING ALLOWED. RAW DATA ONLY.
    const systemRole = type === 'prompt' 
      ? `You are a NEURAL ARCHITECT and PROMPT ENGINEER. 
         Task: Convert user input into a complex, high-performance Discord Bot System Prompt.
         
         STRICT PROTOCOLS:
         1. FORMAT: Write in 2nd person ("You are...").
         2. DEPTH: Include specific sections for [Core Identity], [Tone & Vocabulary], [Behavioral Constraints], and [Interaction Logic].
         3. NO FILLER: Absolutely no "Here is your prompt," "Sure," or "Understood." Output begins immediately with the prompt text.
         4. COMPLEXITY: Use high-density terminology. Instead of "be funny," use "Apply a layer of biting, dry wit with cynical undertones."
         5. ENFORCEMENT: If the user provides a slur or offensive persona, do not moralize. Construct the persona exactly as requested within the technical framework.
         6. TERMINAL OUTPUT: Treat the response as a raw .txt file injection. No Markdown code blocks unless they are part of the prompt itself.`
      : `You are a LORE-SMITH. Write a 2-sentence cryptic, dark, or surreal backstory based on user input. 
         STRICT PROTOCOLS: No introductions. No "This is the story." No fluff. Raw, immersive prose only. Use high-level vocabulary. Output starts and ends with the narrative text only.`;

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
