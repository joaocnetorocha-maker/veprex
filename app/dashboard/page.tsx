'use client'

import { useState, useEffect } from 'react'

const VEHICLES = [
  { id: '1', plate: 'ABC-1234', type: 'truck', config: '6t', description: 'Scania R450 — Frota 01', min_psi: 100, max_temp_c: 80, qr_token: 'demo-truck-01' },
  { id: '2', plate: 'DEF-5678', type: 'trailer', config: '12r', description: 'Carreta Randon 3 eixos', min_psi: 100, max_temp_c: 80, qr_token: 'demo-trail-01' },
  { id: '3', plate: 'GHI-9012', type: 'truck', config: '6t', description: 'Volvo FH — Frota 02', min_psi: 100, max_temp_c: 80, qr_token: 'demo-truck-02' },
  { id: '4', plate: 'JKL-3456', type: 'truck', config: '8t', description: 'Mercedes Actros — Frota 03', min_psi: 100, max_temp_c: 80, qr_token: 'demo-truck-03' },
]

const DEMO_READINGS: Record<string, {psi: number, temp: number, alert: boolean}[]> = {
  '1': [
    { psi: 72, temp: 41, alert: true },
    { psi: 105, temp: 39, alert: false },
    { psi: 107, temp: 42, alert: false },
    { psi: 106, temp: 40, alert: false },
    { psi: 104, temp: 41, alert: false },
    { psi: 105, temp: 38, alert: false },
  ],
  '2': [
    { psi: 105, temp: 38, alert: false },
    { psi: 104, temp: 39, alert: false },
    { psi: 106, temp: 40, alert: false },
    { psi: 105, temp: 38, alert: false },
    { psi: 107, temp: 41, alert: false },
    { psi: 106, temp: 40, alert: false },
    { psi: 104, temp: 39, alert: false },
    { psi: 105, temp: 38, alert: false },
    { psi: 106, temp: 87, alert: true },
    { psi: 105, temp: 40, alert: false },
    { psi: 107, temp: 41, alert: false },
    { psi: 106, temp: 39, alert: false },
  ],
  '3': [
    { psi: 104, temp: 38, alert: false },
    { psi: 106, temp: 39, alert: false },
    { psi: 107, temp: 40, alert: false },
    { psi: 105, temp: 38, alert: false },
    { psi: 104, temp: 39, alert: false },
    { psi: 106, temp: 40, alert: false },
  ],
  '4': [
    { psi: 105, temp: 38, alert: false },
    { psi: 104, temp: 39, alert: false },
    { psi: 107, temp: 40, alert: false },
    { psi: 106, temp: 38, alert: false },
    { psi: 104, temp: 39, alert: false },
    { psi: 105, temp: 40, alert: false },
    { psi: 106, temp: 41, alert: false },
    { psi: 105, temp: 38, alert: false },
    { psi: 107, temp: 40, alert: false },
    { psi: 106, temp: 39, alert: false },
  ],
}

function TireBar({ readings }: { readings: {psi: number, temp: number, alert: boolean}[] }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
      {readings.map((r, i) => (
        <div key={i} style={{
          background: r.alert ? '#FCEBEB' : '#EAF3DE',
          border: `1px solid ${r.alert ? '#F09595' : '#C0DD97'}`,
          borderRadius: 4, padding: '3px 6px', fontSize: 11,
          color: r.alert ? '#A32D2D' : '#27500A', fontWeight: 500
        }}>
          {r.psi} PSI
        </div>
      ))}
    </div>
  )
}

function VehicleCardAlert({ v, readings, onClick }: any) {
  const alerts = readings.filter((r: any) => r.alert)
  return (
    <div onClick={onClick} style={{
      background: '#fff', border: '0.5px solid #F09595',
      borderRadius: 12, padding: 14, cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: 1 }}>{v.plate}</div>
        <div style={{ fontSize: 11, fontWeight: 500, background: '#FCEBEB', color: '#791F1F', borderRadius: 20, padding: '3px 8px' }}>
          {alerts.length === 1 ? '1 alerta' : `${alerts.length} alertas`}
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#888780', marginBottom: 6 }}>{v.description}</div>
      <TireBar readings={readings} />
      {alerts.map((r: any, i: number) => (
        <div key={i} style={{ fontSize: 12, color: '#A32D2D', marginTop: 4 }}>
          ⚠ Pneu {readings.indexOf(r) + 1} — {r.psi < 100 ? `${r.psi} PSI (mín. 100)` : `${r.temp}°C (máx. 80°C)`}
        </div>
      ))}
    </div>
  )
}

function VehicleCardOk({ v, readings, onClick }: any) {
  const min = Math.min(...readings.map((r: any) => r.psi))
  const max = Math.max(...readings.map((r: any) => r.psi))
  return (
    <div onClick={onClick} style={{
      background: '#fff', border: '0.5px solid #E0DDD5',
      borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: 1, marginBottom: 2 }}>{v.plate}</div>
        <div style={{ fontSize: 12, color: '#888780' }}>{min}–{max} PSI · {v.description}</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, background: '#EAF3DE', color: '#27500A', borderRadius: 20, padding: '3px 8px' }}>
        Normal
      </div>
    </div>
  )
}

function Modal({ v, readings, onClose }: any) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.4)', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '16px 16px 0 0',
        padding: '20px 20px 40px', width: '100%', maxWidth: 520,
        maxHeight: '85vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: 2 }}>{v.plate}</div>
            <div style={{ fontSize: 13, color: '#888780' }}>{v.description}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888780' }}>×</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {readings.map((r: any, i: number) => (
            <div key={i} style={{
              background: r.alert ? '#FCEBEB' : '#fff',
              border: `0.5px solid ${r.alert ? '#F09595' : '#E0DDD5'}`,
              borderRadius: 8, padding: '8px 10px'
            }}>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 2 }}>Pneu {i + 1}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: r.alert && r.psi < 100 ? '#A32D2D' : '#1a1a18' }}>{r.psi} PSI</div>
              <div style={{ fontSize: 11, color: r.temp > 80 ? '#A32D2D' : '#888780' }}>{r.temp}°C</div>
            </div>
          ))}
        </div>
        <a href={`/t/${v.qr_token}`} target="_blank" style={{
          display: 'block', marginTop: 16, textAlign: 'center',
          padding: 10, background: '#1D9E75', color: '#fff',
          borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none'
        }}>
          Abrir página pública (QR Code)
        </a>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [selected, setSelected] = useState<string | null>(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })), 30000)
    return () => clearInterval(t)
  }, [])

  const alertVehicles = VEHICLES.filter(v => DEMO_READINGS[v.id].some(r => r.alert))
  const okVehicles = VEHICLES.filter(v => !DEMO_READINGS[v.id].some(r => r.alert))
  const selectedV = selected ? VEHICLES.find(v => v.id === selected) : null

  return (
    <div style={{ minHeight: '100vh', background: '#F1EFE8', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{
        background: '#fff', borderBottom: '0.5px solid #E0DDD5',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: 18, fontWeight: 500 }}>
          <span style={{ color: '#1D9E75' }}>VE</span>PREX
        </span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/vehicles" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none' }}>+ Veículo</a>
          <span style={{ fontSize: 12, color: '#888780' }}>Atualizado {time}</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Monitorados', value: VEHICLES.length, color: '#1a1a18' },
            { label: 'Com alerta', value: alertVehicles.length, color: alertVehicles.length > 0 ? '#A32D2D' : '#1a1a18' },
            { label: 'Normais', value: okVehicles.length, color: '#0F6E56' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '12px 16px', border: '0.5px solid #E0DDD5' }}>
              <div style={{ fontSize: 12, color: '#888780', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {alertVehicles.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#888780', marginBottom: 10 }}>Veículos com alerta</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
              {alertVehicles.map(v => (
                <VehicleCardAlert key={v.id} v={v} readings={DEMO_READINGS[v.id]} onClick={() => setSelected(v.id)} />
              ))}
            </div>
          </>
        )}

        <div style={{ fontSize: 13, fontWeight: 500, color: '#888780', marginBottom: 10 }}>Veículos normais</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {okVehicles.map(v => (
            <VehicleCardOk key={v.id} v={v} readings={DEMO_READINGS[v.id]} onClick={() => setSelected(v.id)} />
          ))}
        </div>

        <div style={{ marginTop: 32, padding: '16px', background: '#fff', borderRadius: 8, border: '0.5px solid #E0DDD5', fontSize: 13, color: '#888780', textAlign: 'center' }}>
          🔌 Dados de demonstração — aguardando conexão com API Carqseng
        </div>
      </div>

      {selectedV && (
        <Modal v={selectedV} readings={DEMO_READINGS[selectedV.id]} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
