import { NextResponse } from 'next/server'
export async function POST() { return NextResponse.json({ error: 'Subscription checkout is not configured' }, { status: 503 }) }
export async function GET() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }) }
