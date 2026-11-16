import { NextResponse } from 'next/server'
import { ENGINE_TIMEOUT_MS, MAX_BODY_BYTES } from '@/lib/limits'
import { allow, clientIp, tooMany } from '@/lib/ratelimit'

const ENGINE_URL = process.env.GOVTRACE_API_URL || 'https://govtrace-api.vercel.app'

export const dynamic = 'force-dynamic'

const tooLarge = () =>
  NextResponse.json({ error: 'too_large', message: 'Request body is too large.' }, { status: 413 })

export async function POST(req: Request) {
  if (!allow(`verify:${clientIp(req)}`)) return tooMany()

  const declared = Number(req.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return tooLarge()
  const raw = await req.text()
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return tooLarge()

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json(
      { error: 'invalid_json', message: 'Request body must be JSON.' },
      { status: 400 },
    )
  }

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ENGINE_TIMEOUT_MS)
  try {
    const upstream = await fetch(`${ENGINE_URL}/verify-receipt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
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
      { error: 'engine_unreachable', message: 'Could not reach the GoVTraceAI engine.' },
      { status: 502 },
    )
  } finally {
    clearTimeout(timer)
  }
}
