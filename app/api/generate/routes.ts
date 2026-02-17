import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // NO 'NEXT_PUBLIC' prefix here. Just the raw secret key.
    const API_KEY = process.env.POLLINATIONS_KEY; 

    const res = await fetch(`https://gen.pollinations.ai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nova-fast', // Hardcoded as requested
        messages: [{ role: 'user', content: prompt }],
        seed: Math.floor(Math.random() * 1000)
      })
    });

    const data = await res.json();
    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ error: "Uplink Error" }, { status: 500 });
  }
}
