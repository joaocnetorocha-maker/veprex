import { NextResponse } from 'next/server'

const BASE = 'https://www.cheyueda.com'
const TOKEN = process.env.CHEYUEDA_TOKEN || ''

async function cheyuedaGet(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Cookie': `token=${TOKEN}`,
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`cheyueda ${path} → ${res.status}`)
  return res.json()
}

export async function GET() {
  try {
    const [vehicles, tires] = await Promise.all([
      cheyuedaGet('/admin/car/list/user_id/?page=1&limit=100'),
      cheyuedaGet('/admin/tire/list?page=1&limit=100'),
    ])
    return NextResponse.json({ ok: true, vehicles, tires })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
