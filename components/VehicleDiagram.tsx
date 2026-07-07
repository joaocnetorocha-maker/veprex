'use client'
import type { VehicleConfig } from '@/lib/types'

interface TireData {
  axle: number
  side: 'L' | 'R'
  pos: 'ext' | 'int' | 'single'
  psi: number | null
  temp: number | null
  status: 'ok' | 'alert' | 'offline'
  isLowPsi?: boolean
  isHighTemp?: boolean
}

interface VehicleDiagramProps {
  config: VehicleConfig
  tires: TireData[]
}

const COLORS = {
  ok:      { fill: '#C0DD97', stroke: '#639922', text: '#27500A' },
  alert:   { fill: '#F7C1C1', stroke: '#E24B4A', text: '#791F1F' },
  offline: { fill: '#D3D1C7', stroke: '#888780', text: '#5F5E5A' },
}

function Tire({ x, y, w, h, psi, status }: {
  x: number; y: number; w: number; h: number
  psi: number | null; status: 'ok' | 'alert' | 'offline'
}) {
  const c = COLORS[status]
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5}/>
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize={8.5} fontWeight={500} fill={c.text} fontFamily="sans-serif">
        {psi !== null ? Math.round(psi) : '—'}
      </text>
    </g>
  )
}

function getTire(tires: TireData[], axle: number, side: 'L' | 'R', pos: 'ext' | 'int' | 'single') {
  return tires.find(t => t.axle === axle && t.side === side && t.pos === pos) ?? null
}

function Truck6({ tires }: { tires: TireData[] }) {
  const tw = 26, th = 17, gap = 3, topY = 4, botY = 109
  return (
    <svg width="100%" viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="36" width="78" height="68" rx="8" fill="none" stroke="#B4B2A9" strokeWidth="1.5"/>
      <rect x="86" y="52" width="300" height="36" rx="4" fill="none" stroke="#B4B2A9" strokeWidth="1.5"/>
      <line x1="118" y1="52" x2="118" y2="136" stroke="#B4B2A9" strokeWidth="2"/>
      <text x="118" y="48" textAnchor="middle" fontSize={8} fill="#888780" fontFamily="sans-serif">Eixo 1</text>
      {getTire(tires,1,'L','single') && <Tire x={105} y={topY} w={tw} h={th} psi={getTire(tires,1,'L','single')!.psi} status={getTire(tires,1,'L','single')!.status}/>}
      {getTire(tires,1,'R','single') && <Tire x={105} y={botY} w={tw} h={th} psi={getTire(tires,1,'R','single')!.psi} status={getTire(tires,1,'R','single')!.status}/>}
      <line x1="310" y1="52" x2="310" y2="136" stroke="#B4B2A9" strokeWidth="2"/>
      <text x="310" y="48" textAnchor="middle" fontSize={8} fill="#888780" fontFamily="sans-serif">Eixo 2</text>
      {getTire(tires,2,'L','ext') && <Tire x={294} y={topY} w={tw} h={th} psi={getTire(tires,2,'L','ext')!.psi} status={getTire(tires,2,'L','ext')!.status}/>}
      {getTire(tires,2,'L','int') && <Tire x={294} y={topY+th+gap} w={tw} h={th} psi={getTire(tires,2,'L','int')!.psi} status={getTire(tires,2,'L','int')!.status}/>}
      {getTire(tires,2,'R','int') && <Tire x={294} y={botY-th-gap} w={tw} h={th} psi={getTire(tires,2,'R','int')!.psi} status={getTire(tires,2,'R','int')!.status}/>}
      {getTire(tires,2,'R','ext') && <Tire x={294} y={botY} w={tw} h={th} psi={getTire(tires,2,'R','ext')!.psi} status={getTire(tires,2,'R','ext')!.status}/>}
      <text x="400" y="78" fontSize="18" fill="#B4B2A9" fontFamily="sans-serif">→</text>
    </svg>
  )
}

function Truck8({ tires }: { tires: TireData[] }) {
  const tw = 22, th = 15, gap = 3, topY = 4, botY = 111
  return (
    <svg width="100%" viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="36" width="68" height="68" rx="8" fill="none" stroke="#B4B2A9" strokeWidth="1.5"/>
      <rect x="76" y="52" width="320" height="36" rx="4" fill="none" stroke="#B4B2A9" strokeWidth="1.5"/>
      <line x1="104" y1="52" x2="104" y2="136" stroke="#B4B2A9" strokeWidth="2"/>
      <text x="104" y="48" textAnchor="middle" fontSize={8} fill="#888780" fontFamily="sans-serif">Eixo 1</text>
      {getTire(tires,1,'L','single') && <Tire x={91} y={topY} w={tw} h={th} psi={getTire(tires,1,'L','single')!.psi} status={getTire(tires,1,'L','single')!.status}/>}
      {getTire(tires,1,'R','single') && <Tire x={91} y={botY} w={tw} h={th} psi={getTire(tires,1,'R','single')!.psi} status={getTire(tires,1,'R','single')!.status}/>}
      <line x1="256" y1="52" x2="256" y2="136" stroke="#B4B2A9" strokeWidth="2"/>
      <text x="256" y="48" textAnchor="middle" fontSize={8} fill="#888780" fontFamily="sans-serif">Eixo 2</text>
      {getTire(tires,2,'L','ext') && <Tire x={242} y={topY} w={tw} h={th} psi={getTire(tires,2,'L','ext')!.psi} status={getTire(tires,2,'L','ext')!.status}/>}
      {getTire(tires,2,'L','int') && <Tire x={242} y={topY+th+gap} w={tw} h={th} psi={getTire(tires,2,'L','int')!.psi} status={getTire(tires,2,'L','int')!.status}/>}
      {getTire(tires,2,'R','int') && <Tire x={242} y={botY-th-gap} w={tw} h={th} psi={getTire(tires,2,'R','int')!.psi} status={getTire(tires,2,'R','int')!.status}/>}
      {getTire(tires,2,'R','ext') && <Tire x={242} y={botY} w={tw} h={th} psi={getTire(tires,2,'R','ext')!.psi} status={getTire(tires,2,'R','ext')!.status}/>}
      <line x1="340" y1="52" x2="340" y2="136" stroke="#B4B2A9" strokeWidth="2"/>
      <text x="340" y="48" textAnchor="middle" fontSize={8} fill="#888780" fontFamily="sans-serif">Eixo 3</text>
      {getTire(tires,3,'L','ext') && <Tire x={326} y={topY} w={tw} h={th} psi={getTire(tires,3,'L','ext')!.psi} status={getTire(tires,3,'L','ext')!.status}/>}
      {getTire(tires,3,'L','int') && <Tire x={326} y={topY+th+gap} w={tw} h={th} psi={getTire(tires,3,'L','int')!.psi} status={getTire(tires,3,'L','int')!.status}/>}
      {getTire(tires,3,'R','int') && <Tire x={326} y={botY-th-gap} w={tw} h={th} psi={getTire(tires,3,'R','int')!.psi} status={getTire(tires,3,'R','int')!.status}/>}
      {getTire(tires,3,'R','ext') && <Tire x={326} y={botY} w={tw} h={th} psi={getTire(tires,3,'R','ext')!.psi} status={getTire(tires,3,'R','ext')!.status}/>}
      <text x="400" y="78" fontSize="18" fill="#B4B2A9" fontFamily="sans-serif">→</text>
    </svg>
  )
}

function Trailer({ tires, axles }: { tires: TireData[]; axles: number }) {
  const tw = 22, th = 15, gap = 3, topY = 4, botY = 111
  const axlePositions = axles === 2 ? [260, 350] : [200, 290, 378]
  return (
    <svg width="100%" viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="52" width="10" height="16" rx="2" fill="none" stroke="#B4B2A9" strokeWidth="1"/>
      <rect x="14" y="36" width="390" height="24" rx="4" fill="none" stroke="#B4B2A9" strokeWidth="1.5"/>
      <rect x="14" y="80" width="390" height="24" rx="4" fill="none" stroke="#B4B2A9" strokeWidth="1.5"/>
      {axlePositions.map((ax, i) => {
        const axleNum = i + 1
        return (
          <g key={axleNum}>
            <line x1={ax} y1="36" x2={ax} y2="136" stroke="#B4B2A9" strokeWidth="2"/>
            <text x={ax} y="74" textAnchor="middle" fontSize={8} fill="#888780" fontFamily="sans-serif">Eixo {axleNum}</text>
            {getTire(tires,axleNum,'L','ext') && <Tire x={ax-13} y={topY} w={tw} h={th} psi={getTire(tires,axleNum,'L','ext')!.psi} status={getTire(tires,axleNum,'L','ext')!.status}/>}
            {getTire(tires,axleNum,'L','int') && <Tire x={ax-13} y={topY+th+gap} w={tw} h={th} psi={getTire(tires,axleNum,'L','int')!.psi} status={getTire(tires,axleNum,'L','int')!.status}/>}
            {getTire(tires,axleNum,'R','int') && <Tire x={ax-13} y={botY-th-gap} w={tw} h={th} psi={getTire(tires,axleNum,'R','int')!.psi} status={getTire(tires,axleNum,'R','int')!.status}/>}
            {getTire(tires,axleNum,'R','ext') && <Tire x={ax-13} y={botY} w={tw} h={th} psi={getTire(tires,axleNum,'R','ext')!.psi} status={getTire(tires,axleNum,'R','ext')!.status}/>}
          </g>
        )
      })}
      <text x="400" y="78" fontSize="18" fill="#B4B2A9" fontFamily="sans-serif">→</text>
    </svg>
  )
}

export function VehicleDiagram({ config, tires }: VehicleDiagramProps) {
  if (config === '6t') return <Truck6 tires={tires}/>
  if (config === '8t') return <Truck8 tires={tires}/>
  if (config === '8r') return <Trailer tires={tires} axles={2}/>
  if (config === '12r') return <Trailer tires={tires} axles={3}/>
  return null
}
