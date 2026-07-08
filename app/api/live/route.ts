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
    const [vehiclesRes, tiresRes] = await Promise.all([
      cheyuedaGet('/admin/car/list/user_id/?page=1&limit=100'),
      cheyuedaGet('/admin/tire/list?page=1&limit=100'),
    ])

    const vehicles = vehiclesRes.data || []
    const tires = tiresRes.data || []

    const conjuntos = vehicles.map((v: any) => {
      const vTires = tires.filter((t: any) => t.car_id === v.id)
      const hasAlert = vTires.some((t: any) =>
        (t.tire_pressure !== null && t.tire_pressure < 100) ||
        (t.temperature !== null && t.temperature > 80)
      )
      return {
        id: String(v.id),
        online: v.networking_status === 1,
        placa: v.license_plate,
        device_sn: v.device_serial_number,
        hasAlert,
        alertas: vTires
          .filter((t: any) =>
            (t.tire_pressure !== null && t.tire_pressure < 100) ||
            (t.temperature !== null && t.temperature > 80)
          )
          .map((t: any) => ({
            type: t.tire_pressure !== null && t.tire_pressure < 100 ? 'low_psi' : 'high_temp',
            value: t.tire_pressure ?? t.temperature,
            location: `pneu ${t.tire_num}`,
            delta: t.tire_pressure !== null ? t.tire_pressure - 100 : t.temperature - 80,
          })),
        pneus: vTires.map((t: any) => ({
          tire_num: t.tire_num,
          psi: t.tire_pressure,
          temp: t.temperature,
          battery: t.tire_electricity,
          status: t.status,
        })),
      }
    })

    return NextResponse.json({ ok: true, conjuntos, raw: { vehicles, tires } })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
