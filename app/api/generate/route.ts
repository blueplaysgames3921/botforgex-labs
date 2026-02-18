import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; 

    // 1. Define the endpoints
    const authEndpoint = 'https://gen.pollinations.ai/v1/chat/completions';
    const publicEndpoint = 'https://text.pollinations.ai/';

    let responseText = "";

    // 2. STRATEGY A: If Key exists, try Authenticated (Fastest/Best)
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
            messages: [{ role: 'user', content: prompt }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ content: data.choices[0].message.content });
        }
        console.warn("Auth endpoint failed, falling back to public...");
      } catch (e) {
        console.error("Auth Error:", e);
      }
    }

    // 3. STRATEGY B: Public Fallback (Server-side proxy)
    // We use a GET request to the text endpoint which is robust for free tier
    try {
        // We limit prompt length for the GET request to avoid 414 errors
        const safePrompt = prompt.substring(0, 1000); 
        const res = await fetch(`${publicEndpoint}${encodeURIComponent(safePrompt)}?model=nova-fast`);
        
        if (res.ok) {
            responseText = await res.text();
            return NextResponse.json({ content: responseText });
        }
    } catch (e) {
        console.error("Public Fallback Error:", e);
    }

    // 4. If BOTH fail, return specific error
    return NextResponse.json({ error: "All AI uplinks failed" }, { status: 502 });

  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
