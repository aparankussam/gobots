import { NextResponse } from 'next/server'

const ENGINE_URL = process.env.GOVTRACE_API_URL || 'https://govtrace-api.vercel.app'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_json', message: 'Request body must be JSON.' },
      { status: 400 },
    )
  }

  try {
    const upstream = await fetch(`${ENGINE_URL}/audit`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    const text = await upstream.text()
    return new Response(text, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: 'engine_unreachable',
        message: 'Could not reach the GoVTraceAI engine.',
      },
      { status: 502 },
    )
  }
}
