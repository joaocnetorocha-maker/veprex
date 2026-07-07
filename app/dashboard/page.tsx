'use client'
import { useState, useEffect } from 'react'

const CONJUNTOS = [
  {
    id: '1',
    alerta: true,
    alertas: 1,
    cavalo: { placa: 'ABC-1234', desc: 'Scania R450' },
    carreta: { placa: 'XYZ-5678', desc: 'Randon 3 eixos' },
    pneus: {
      e1_esq: 116, e1_dir: 114,
      e2_ee: 118, e2_ei: 117, e2_di: 119, e2_de: 116,
      e3_ee: 84,  e3_ei: 117, e3_di: 118, e3_de: 116,
      e4_ee: 119, e4_ei: 117, e4_di: 118, e4_de: 116,
      e5_ee: 117, e5_ei: 118, e5_di: 119, e5_de: 116,
    }
  },
  {
    id: '2',
    alerta: false,
    alertas: 0,
    cavalo: { placa: 'DEF-9012', desc: 'Volvo FH' },
    carreta: { placa: 'GHI-3456', desc: 'Randon 2 eixos' },
    pneus: null
  }
]

function Tire({ x, y, w, h, psi, min = 100 }: { x: number; y: number; w: number; h: number; psi: number; min?: number }) {
  const alert = psi < min
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2}
        fill={alert ? '#3a0000' : '#1a2e00'}
        stroke={alert ? '#FF3333' : '#C8E000'}
        strokeWidth={alert ? 1.8 : 1.5}/>
      <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle"
        fontFamily="monospace" fontSize={9} fontWeight="bold"
        fill={alert ? '#FF4444' : '#C8E000'}>
        {psi}
      </text>
    </g>
  )
}

function DiagramaConjunto({ p }: { p: typeof CONJUNTOS[0]['pneus'] }) {
  if (!p) return null
  return (
    <svg width="100%" viewBox="0 0 680 130">
      {/* Cabine */}
      <rect x="8" y="38" width="52" height="54" rx="5" fill="none" stroke="#C8E000" strokeWidth="1.5"/>
      <rect x="14" y="45" width="28" height="22" rx="2" fill="none" stroke="#8a9900" strokeWidth="1"/>
      {/* Chassi cavalo */}
      <line x1="60" y1="52" x2="210" y2="52" stroke="#C8E000" strokeWidth="1.5"/>
      <line x1="60" y1="78" x2="210" y2="78" stroke="#C8E000" strokeWidth="1.5"/>
      {/* Eixo 1 */}
      <line x1="108" y1="44" x2="108" y2="86" stroke="#C8E000" strokeWidth="1.5"/>
      <Tire x={88} y={26} w={40} h={16} psi={p.e1_esq}/>
      <Tire x={88} y={88} w={40} h={16} psi={p.e1_dir}/>
      <text x="108" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo 1</text>
      {/* Eixo 2 duplo */}
      <line x1="188" y1="44" x2="188" y2="86" stroke="#C8E000" strokeWidth="1.5"/>
      <Tire x={168} y={22} w={40} h={14} psi={p.e2_ee}/>
      <Tire x={168} y={38} w={40} h={14} psi={p.e2_ei}/>
      <Tire x={168} y={78} w={40} h={14} psi={p.e2_di}/>
      <Tire x={168} y={94} w={40} h={14} psi={p.e2_de}/>
      <text x="188" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo 2</text>
      {/* Engate */}
      <line x1="210" y1="65" x2="238" y2="65" stroke="#888" strokeWidth="2" strokeDasharray="3 3"/>
      <circle cx="224" cy="65" r="5" fill="none" stroke="#888" strokeWidth="1.5"/>
      <rect x="238" y="58" width="8" height="14" rx="2" fill="#C8E000"/>
      {/* Chassi carreta */}
      <line x1="246" y1="52" x2="665" y2="52" stroke="#C8E000" strokeWidth="1.5"/>
      <line x1="246" y1="78" x2="665" y2="78" stroke="#C8E000" strokeWidth="1.5"/>
      <line x1="665" y1="52" x2="665" y2="78" stroke="#C8E000" strokeWidth="1.5"/>
      {/* Eixo 3 */}
      <line x1="360" y1="44" x2="360" y2="86" stroke="#C8E000" strokeWidth="1.5"/>
      <Tire x={340} y={22} w={40} h={14} psi={p.e3_ee}/>
      <Tire x={340} y={38} w={40} h={14} psi={p.e3_ei}/>
      <Tire x={340} y={78} w={40} h={14} psi={p.e3_di}/>
      <Tire x={340} y={94} w={40} h={14} psi={p.e3_de}/>
      <text x="360" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo 3</text>
      {/* Eixo 4 */}
      <line x1="490" y1="44" x2="490" y2="86" stroke="#C8E000" strokeWidth="1.5"/>
      <Tire x={470} y={22} w={40} h={14} psi={p.e4_ee}/>
      <Tire x={470} y={38} w={40} h={14} psi={p.e4_ei}/>
      <Tire x={470} y={78} w={40} h={14} psi={p.e4_di}/>
      <Tire x={470} y={94} w={40} h={14} psi={p.e4_de}/>
      <text x="490" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo 4</text>
      {/* Eixo 5 */}
      <line x1="620" y1="44" x2="620" y2="86" stroke="#C8E000" strokeWidth="1.5"/>
      <Tire x={600} y={22} w={40} h={14} psi={p.e5_ee}/>
      <Tire x={600} y={38} w={40} h={14} psi={p.e5_ei}/>
      <Tire x={600} y={78} w={40} h={14} psi={p.e5_di}/>
      <Tire x={600} y={94} w={40} h={14} psi={p.e5_de}/>
      <text x="620" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo 5</text>
      {/* Labels */}
      <text x="108" y="9" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">CAVALO</text>
      <line x1="68" y1="12" x2="148" y2="12" stroke="#555" strokeWidth="0.5"/>
      <text x="454" y="9" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">CARRETA</text>
      <line x1="260" y1="12" x2="648" y2="12" stroke="#555" strokeWidth="0.5"/>
      {p.e3_ee < 100 && (
        <text x="8" y="128" fontFamily="sans-serif" fontSize={8} fill="#FF4444">
          ⚠ PRESSÃO BAIXA — Eixo 3 esq. ext. {p.e3_ee} PSI (mín. 100 PSI)
        </text>
      )}
    </svg>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setTime(fmt())
    const t = setInterval(() => setTime(fmt()), 30000)
    return () => clearInterval(t)
  }, [])

  const alertas = CONJUNTOS.filter(c => c.alerta)
  const normais = CONJUNTOS.filter(c => !c.alerta)

  return (
    <div style={{ minHeight: '100vh', background: '#F1EFE8', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{
        background: '#fff', borderBottom: '0.5px solid #E0DDD5',
        padding: '0 24px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: 17, fontWeight: 500 }}>
          <span style={{ color: '#1D9E75' }}>VE</span>PREX
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12, color: '#888780' }}>{CONJUNTOS.length} conjuntos · {time}</span>
          <a href="/vehicles" style={{
            fontSize: 12, fontWeight: 500, background: '#EAF3DE',
            color: '#0F6E56', border: 'none', borderRadius: 6,
            padding: '5px 12px', cursor: 'pointer', textDecoration: 'none'
          }}>+ Conjunto</a>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Conjuntos', value: CONJUNTOS.length, color: '#1a1a18', border: '#E0DDD5' },
            { label: 'Com alerta', value: alertas.length, color: '#A32D2D', border: '#F09595' },
            { label: 'Normais', value: normais.length, color: '#0F6E56', border: '#E0DDD5' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', border: `0.5px solid ${s.border}`,
              borderRadius: 10, padding: '14px 16px'
            }}>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {alertas.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#888780', letterSpacing: '0.5px', marginBottom: 10 }}>ALERTAS</div>
            {alertas.map(c => (
              <div key={c.id} style={{
                background: '#fff', border: '0.5px solid #F09595',
                borderRadius: 12, overflow: 'hidden', marginBottom: 12
              }}>
                <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1, color: '#1a1a18' }}>{c.cavalo.placa}</span>
                      <span style={{ fontSize: 11, color: '#888780', marginLeft: 8 }}>{c.cavalo.desc}</span>
                    </div>
                    <div style={{ width: 1, height: 16, background: '#E0DDD5' }}/>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1, color: '#1a1a18' }}>{c.carreta.placa}</span>
                      <span style={{ fontSize: 11, color: '#888780', marginLeft: 8 }}>{c.carreta.desc}</span>
                    </div>
                  </div>
                  <span style={{
                    background: '#FCEBEB', color: '#791F1F',
                    fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 8px', whiteSpace: 'nowrap'
                  }}>{c.alertas} alerta</span>
                </div>
                <div style={{ background: '#0d0d0d', margin: '0 12px 12px', borderRadius: 8, padding: '12px 10px' }}>
                  <DiagramaConjunto p={c.pneus}/>
                </div>
              </div>
            ))}
          </>
        )}

        {normais.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#888780', letterSpacing: '0.5px', marginBottom: 10 }}>NORMAIS</div>
            {normais.map(c => (
              <div key={c.id} style={{
                background: '#fff', border: '0.5px solid #E0DDD5',
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 8
              }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1, color: '#1a1a18' }}>{c.cavalo.placa}</span>
                    <span style={{ fontSize: 11, color: '#888780', marginLeft: 8 }}>{c.cavalo.desc}</span>
                  </div>
                  <div style={{ width: 1, height: 14, background: '#E0DDD5' }}/>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1, color: '#1a1a18' }}>{c.carreta.placa}</span>
                    <span style={{ fontSize: 11, color: '#888780', marginLeft: 8 }}>{c.carreta.desc}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#888780' }}>114 – 120 PSI · 14 pneus</span>
                  <span style={{
                    background: '#EAF3DE', color: '#27500A',
                    fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 8px'
                  }}>Normal</span>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{
          marginTop: 20, padding: '11px 14px',
          background: '#fff', borderRadius: 8,
          border: '0.5px solid #E0DDD5',
          fontSize: 12, color: '#888780'
        }}>
          🔌 Dados de demonstração — aguardando conexão com API Carqseng
        </div>
      </div>
    </div>
  )
}
