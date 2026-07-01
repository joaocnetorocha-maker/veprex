export type VehicleType = 'truck' | 'trailer'
export type VehicleConfig = '6t' | '8t' | '8r' | '12r'
export type AlertType = 'low_psi' | 'high_temp' | 'offline' | 'battery'
export type TireSide = 'L' | 'R'
export type TirePos = 'ext' | 'int' | 'single'

export interface Vehicle {
  id: string
  company_id: string
  plate: string
  type: VehicleType
  config: VehicleConfig
  description?: string
  qr_token: string
  min_psi: number
  max_temp_c: number
  active: boolean
  created_at: string
}

export interface Sensor {
  id: string
  vehicle_id: string
  rf_id: string
  axle: number
  side: TireSide
  pos: TirePos
  active: boolean
}

export interface TireReading {
  id: number
  sensor_id: string
  vehicle_id: string
  pressure_psi: number
  pressure_bar: number
  temperature_c: number
  battery_ok: boolean
  created_at: string
  axle?: number
  side?: TireSide
  pos?: TirePos
  rf_id?: string
}

export interface Alert {
  id: string
  vehicle_id: string
  sensor_id: string
  type: AlertType
  value?: number
  threshold?: number
  resolved: boolean
  resolved_at?: string
  created_at: string
}

export interface TirePosition {
  axle: number
  side: TireSide
  pos: TirePos
  label: string
}

export const VEHICLE_TIRE_POSITIONS: Record<VehicleConfig, TirePosition[]> = {
  '6t': [
    { axle: 1, side: 'L', pos: 'single', label: 'Eixo 1 — esq.' },
    { axle: 1, side: 'R', pos: 'single', label: 'Eixo 1 — dir.' },
    { axle: 2, side: 'L', pos: 'ext', label: 'Eixo 2 — esq. ext.' },
    { axle: 2, side: 'L', pos: 'int', label: 'Eixo 2 — esq. int.' },
    { axle: 2, side: 'R', pos: 'int', label: 'Eixo 2 — dir. int.' },
    { axle: 2, side: 'R', pos: 'ext', label: 'Eixo 2 — dir. ext.' },
  ],
  '8t': [
    { axle: 1, side: 'L', pos: 'single', label: 'Eixo 1 — esq.' },
    { axle: 1, side: 'R', pos: 'single', label: 'Eixo 1 — dir.' },
    { axle: 2, side: 'L', pos: 'ext', label: 'Eixo 2 — esq. ext.' },
    { axle: 2, side: 'L', pos: 'int', label: 'Eixo 2 — esq. int.' },
    { axle: 2, side: 'R', pos: 'int', label: 'Eixo 2 — dir. int.' },
    { axle: 2, side: 'R', pos: 'ext', label: 'Eixo 2 — dir. ext.' },
    { axle: 3, side: 'L', pos: 'ext', label: 'Eixo 3 — esq. ext.' },
    { axle: 3, side: 'L', pos: 'int', label: 'Eixo 3 — esq. int.' },
    { axle: 3, side: 'R', pos: 'int', label: 'Eixo 3 — dir. int.' },
    { axle: 3, side: 'R', pos: 'ext', label: 'Eixo 3 — dir. ext.' },
  ],
  '8r': [
    { axle: 1, side: 'L', pos: 'ext', label: 'Eixo 1 — esq. ext.' },
    { axle: 1, side: 'L', pos: 'int', label: 'Eixo 1 — esq. int.' },
    { axle: 1, side: 'R', pos: 'int', label: 'Eixo 1 — dir. int.' },
    { axle: 1, side: 'R', pos: 'ext', label: 'Eixo 1 — dir. ext.' },
    { axle: 2, side: 'L', pos: 'ext', label: 'Eixo 2 — esq. ext.' },
    { axle: 2, side: 'L', pos: 'int', label: 'Eixo 2 — esq. int.' },
    { axle: 2, side: 'R', pos: 'int', label: 'Eixo 2 — dir. int.' },
    { axle: 2, side: 'R', pos: 'ext', label: 'Eixo 2 — dir. ext.' },
  ],
  '12r': [
    { axle: 1, side: 'L', pos: 'ext', label: 'Eixo 1 — esq. ext.' },
    { axle: 1, side: 'L', pos: 'int', label: 'Eixo 1 — esq. int.' },
    { axle: 1, side: 'R', pos: 'int', label: 'Eixo 1 — dir. int.' },
    { axle: 1, side: 'R', pos: 'ext', label: 'Eixo 1 — dir. ext.' },
    { axle: 2, side: 'L', pos: 'ext', label: 'Eixo 2 — esq. ext.' },
    { axle: 2, side: 'L', pos: 'int', label: 'Eixo 2 — esq. int.' },
    { axle: 2, side: 'R', pos: 'int', label: 'Eixo 2 — dir. int.' },
    { axle: 2, side: 'R', pos: 'ext', label: 'Eixo 2 — dir. ext.' },
    { axle: 3, side: 'L', pos: 'ext', label: 'Eixo 3 — esq. ext.' },
    { axle: 3, side: 'L', pos: 'int', label: 'Eixo 3 — esq. int.' },
    { axle: 3, side: 'R', pos: 'int', label: 'Eixo 3 — dir. int.' },
    { axle: 3, side: 'R', pos: 'ext', label: 'Eixo 3 — dir. ext.' },
  ],
}

export const VEHICLE_CONFIG_LABELS: Record<VehicleConfig, string> = {
  '6t':  'Cavalo — 6 pneus (2+4)',
  '8t':  'Cavalo — 8 pneus (2+4+4)',
  '8r':  'Carreta — 2 eixos (8 pneus)',
  '12r': 'Carreta — 3 eixos (12 pneus)',
}

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  truck:   'Cavalo mecânico',
  trailer: 'Carreta / Reboque',
}
