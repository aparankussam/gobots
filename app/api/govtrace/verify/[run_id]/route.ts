import { NextResponse } from 'next/server'
import { ENGINE_TIMEOUT_MS } from '@/lib/limits'
import { allow, clientIp, tooMany } from '@/lib/ratelimit'

const ENGINE_URL = process.env.GOVTRACE_API_URL || 'https://govtrace-api.vercel.app'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { run_id: string } },
) {
  if (!allow(`verify:${clientIp(req)}`)) return tooMany()
  const runId = encodeURIComponent(params.run_id)
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ENGINE_TIMEOUT_MS)
  try {
    const upstream = await fetch(`${ENGINE_URL}/audit/verify/${runId}`, {
      cache: 'no-store',
      signal: ctrl.signal,
    })
    const text = await upstream.text()
    return new Response(text, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch {
    if (ctrl.signal.aborted) {
      return NextResponse.json(
        { error: 'engine_timeout', message: 'The GoVTraceAI engine did not answer in time.' },
        { status: 504 },
      )
    }
    return NextResponse.json(
      {
        error: 'engine_unreachable',
        message: 'Could not reach the GoVTraceAI engine.',
      },
      { status: 502 },
    )
  } finally {
    clearTimeout(timer)
  }
}
