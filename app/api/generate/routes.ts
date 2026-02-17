import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.POLLINATIONS_KEY; // Secret server-side variable

    const res = await fetch(`https://gen.pollinations.ai/v1/chat/completions`, {
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

    if (!res.ok) throw new Error("Pollinations API rejected the request");

    const data = await res.json();
    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (e) {
    console.error("Route Error:", e);
    return NextResponse.json({ error: "Uplink failed" }, { status: 500 });
  }
}
