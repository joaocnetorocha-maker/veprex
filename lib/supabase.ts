import { createClient } from '@supabase/supabase-js'
import type { Vehicle, TireReading, Alert, VehicleConfig } from './types'
import { VEHICLE_TIRE_POSITIONS } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getVehicleByToken(token: string) {
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('qr_token', token)
    .eq('active', true)
    .single()

  if (error || !vehicle) return null

  const { data: readings } = await supabase
    .from('latest_readings')
    .select('*')
    .eq('vehicle_id', vehicle.id)

  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('vehicle_id', vehicle.id)
    .eq('resolved', false)

  return {
    vehicle: vehicle as Vehicle,
    readings: (readings || []) as TireReading[],
    alerts: (alerts || []) as Alert[],
  }
}

export function mapReadingsToPositions(
  config: VehicleConfig,
  readings: TireReading[],
  minPsi: number,
  maxTempC: number
) {
  const positions = VEHICLE_TIRE_POSITIONS[config]

  return positions.map(pos => {
    const reading = readings.find(
      r => r.axle === pos.axle && r.side === pos.side && r.pos === pos.pos
    )

    const psi = reading?.pressure_psi ?? null
    const temp = reading?.temperature_c ?? null
    const isLowPsi = psi !== null && psi < minPsi
    const isHighTemp = temp !== null && temp > maxTempC
    const isOffline = psi === null

    return {
      ...pos,
      psi,
      temp,
      isLowPsi,
      isHighTemp,
      isOffline,
      status: isOffline ? 'offline' : isLowPsi || isHighTemp ? 'alert' : 'ok',
    }
  })
}

export async function createVehicle(data: {
  company_id: string
  plate: string
  type: string
  config: string
  description?: string
  min_psi?: number
  max_temp_c?: number
}) {
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return vehicle
}
