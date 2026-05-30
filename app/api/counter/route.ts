import { NextResponse } from 'next/server'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzS5vGIU_22mNIPSJH3Js5mhlHZhKlAgomjARADwbpJOYlEsVVl2ky4JBB2S-ThKOiKhw/exec'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch(SCRIPT_URL, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json({ count: typeof data.count === 'number' ? data.count : null })
  } catch {
    return NextResponse.json({ count: null })
  }
}
