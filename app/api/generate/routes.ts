import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Get the prompt from your frontend
    const { prompt } = await req.json();
    
    // 2. Get your secret key
    // CRITICAL: This variable must exist in Vercel Settings or .env.local
    const API_KEY = process.env.POLLINATIONS_KEY; 

    if (!API_KEY) {
        console.error("❌ ERROR: POLLINATIONS_KEY is missing in environment variables!");
        return NextResponse.json({ error: "Server Key Config Missing" }, { status: 500 });
    }

    // 3. Call Pollinations (Nova-Fast)
    const res = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nova-fast',
        messages: [{ role: 'user', content: prompt }],
        seed: Math.floor(Math.random() * 1000)
      })
    });

    // 4. Handle API Errors
    if (!res.ok) {
        const errText = await res.text();
        console.error(`❌ API ERROR: ${res.status}`, errText);
        return NextResponse.json({ error: "AI Provider Rejected" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ content: data.choices[0].message.content });

  } catch (e) {
    console.error("❌ CRITICAL SERVER ERROR:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
