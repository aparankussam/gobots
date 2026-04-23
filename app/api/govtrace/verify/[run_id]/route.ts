import { NextResponse } from 'next/server'

const ENGINE_URL = process.env.GOVTRACE_API_URL || 'https://govtrace-api.vercel.app'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { run_id: string } },
) {
  const runId = encodeURIComponent(params.run_id)
  try {
    const upstream = await fetch(`${ENGINE_URL}/audit/verify/${runId}`, {
      cache: 'no-store',
    })
    const text = await upstream.text()
    return new Response(text, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch {
    return NextResponse.json(
      {
        error: 'engine_unreachable',
        message: 'Could not reach the GoVTraceAI engine.',
      },
      { status: 502 },
    )
  }
}
