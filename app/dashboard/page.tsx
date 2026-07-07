'use client'
import { useState, useEffect } from 'react'

const CONJUNTOS = [
  {
    id: '1', alerta: true, alertas: 1,
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
    id: '2', alerta: false, alertas: 0,
    cavalo: { placa: 'DEF-9012', desc: 'Volvo FH' },
    carreta: { placa: 'GHI-3456', desc: 'Randon 2 eixos' },
    pneus: null
  }
]

const G = '#C8E000'
const R = '#FF3333'

function Tire({ x, y, w, h, psi, min = 100 }: { x: number; y: number; w: number; h: number; psi: number; min?: number }) {
  const alert = psi < min
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2}
        fill={alert ? '#3a0000' : '#1a2e00'}
        stroke={alert ? R : G}
        strokeWidth={alert ? 1.8 : 1.5}/>
      <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle"
        fontFamily="monospace" fontSize={9} fontWeight="bold"
        fill={alert ? '#FF4444' : G}>
        {psi}
      </text>
    </g>
  )
}

function Diagrama({ p }: { p: typeof CONJUNTOS[0]['pneus'] }) {
  if (!p) return null
  const hasAlert = p.e3_ee < 100
  return (
    <svg width="100%" viewBox="0 0 680 130">
      <rect x="8" y="38" width="52" height="54" rx="5" fill="none" stroke={G} strokeWidth="1.5"/>
      <rect x="14" y="45" width="28" height="22" rx="2" fill="none" stroke="#8a9900" strokeWidth="1"/>
      <line x1="60" y1="52" x2="210" y2="52" stroke={G} strokeWidth="1.5"/>
      <line x1="60" y1="78" x2="210" y2="78" stroke={G} strokeWidth="1.5"/>
      <line x1="108" y1="44" x2="108" y2="86" stroke={G} strokeWidth="1.5"/>
      <Tire x={88} y={26} w={40} h={16} psi={p.e1_esq}/>
      <Tire x={88} y={88} w={40} h={16} psi={p.e1_dir}/>
      <text x="108" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 1</text>
      <line x1="188" y1="44" x2="188" y2="86" stroke={G} strokeWidth="1.5"/>
      <Tire x={168} y={22} w={40} h={14} psi={p.e2_ee}/>
      <Tire x={168} y={38} w={40} h={14} psi={p.e2_ei}/>
      <Tire x={168} y={78} w={40} h={14} psi={p.e2_di}/>
      <Tire x={168} y={94} w={40} h={14} psi={p.e2_de}/>
      <text x="188" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 2</text>
      <line x1="210" y1="65" x2="238" y2="65" stroke="#666" strokeWidth="2" strokeDasharray="3 3"/>
      <circle cx="224" cy="65" r="5" fill="none" stroke="#666" strokeWidth="1.5"/>
      <rect x="238" y="58" width="8" height="14" rx="2" fill={G}/>
      <line x1="246" y1="52" x2="665" y2="52" stroke={G} strokeWidth="1.5"/>
      <line x1="246" y1="78" x2="665" y2="78" stroke={G} strokeWidth="1.5"/>
      <line x1="665" y1="52" x2="665" y2="78" stroke={G} strokeWidth="1.5"/>
      <line x1="360" y1="44" x2="360" y2="86" stroke={G} strokeWidth="1.5"/>
      <Tire x={340} y={22} w={40} h={14} psi={p.e3_ee}/>
      <Tire x={340} y={38} w={40} h={14} psi={p.e3_ei}/>
      <Tire x={340} y={78} w={40} h={14} psi={p.e3_di}/>
      <Tire x={340} y={94} w={40} h={14} psi={p.e3_de}/>
      <text x="360" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 3</text>
      <line x1="490" y1="44" x2="490" y2="86" stroke={G} strokeWidth="1.5"/>
      <Tire x={470} y={22} w={40} h={14} psi={p.e4_ee}/>
      <Tire x={470} y={38} w={40} h={14} psi={p.e4_ei}/>
      <Tire x={470} y={78} w={40} h={14} psi={p.e4_di}/>
      <Tire x={470} y={94} w={40} h={14} psi={p.e4_de}/>
      <text x="490" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 4</text>
      <line x1="620" y1="44" x2="620" y2="86" stroke={G} strokeWidth="1.5"/>
      <Tire x={600} y={22} w={40} h={14} psi={p.e5_ee}/>
      <Tire x={600} y={38} w={40} h={14} psi={p.e5_ei}/>
      <Tire x={600} y={78} w={40} h={14} psi={p.e5_di}/>
      <Tire x={600} y={94} w={40} h={14} psi={p.e5_de}/>
      <text x="620" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 5</text>
      <text x="108" y="9" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">CAVALO</text>
      <line x1="68" y1="12" x2="148" y2="12" stroke="#555" strokeWidth="0.5"/>
      <text x="454" y="9" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">CARRETA</text>
      <line x1="260" y1="12" x2="648" y2="12" stroke="#555" strokeWidth="0.5"/>
      {hasAlert && (
        <text x="8" y="128" fontFamily="sans-serif" fontSize={8} fill={R}>
          ⚠ PRESSÃO BAIXA — Eixo 3 esq. ext. {p.e3_ee} PSI (mín. 100 PSI)
        </text>
      )}
    </svg>
  )
}

const S = {
  page: { minHeight: '100vh', background: '#0d0d0d', fontFamily: 'system-ui, sans-serif', color: '#e0e0dc' } as React.CSSProperties,
  nav: { background: '#141414', borderBottom: '0.5px solid #2a2a2a', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  logo: { fontSize: 17, fontWeight: 500, color: '#e0e0dc' } as React.CSSProperties,
  logoGreen: { color: '#C8E000' } as React.CSSProperties,
  navRight: { display: 'flex', alignItems: 'center', gap: 20 } as React.CSSProperties,
  navMuted: { fontSize: 12, color: '#555' } as React.CSSProperties,
  btn: { fontSize: 12, fontWeight: 500, background: '#1a2e00', color: '#C8E000', border: '0.5px solid #C8E000', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' } as React.CSSProperties,
  wrap: { maxWidth: 960, margin: '0 auto', padding: '20px' } as React.CSSProperties,
  sectionLabel: { fontSize: 11, fontWeight: 500, color: '#555', letterSpacing: '0.5px', marginBottom: 10 } as React.CSSProperties,
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 } as React.CSSProperties,
  statCard: { background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: 10, padding: '14px 16px' } as React.CSSProperties,
  statLabel: { fontSize: 11, color: '#555', marginBottom: 4 } as React.CSSProperties,
  cardAlert: { background: '#141414', border: '0.5px solid #5a1a1a', borderRadius: 12, overflow: 'hidden' as const, marginBottom: 12 },
  cardOk: { background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } as React.CSSProperties,
  cardHeader: { padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as React.CSSProperties,
  diagramWrap: { background: '#0a0a0a', margin: '0 12px 12px', borderRadius: 8, padding: '12px 10px' } as React.CSSProperties,
  plate: { fontSize: 14, fontWeight: 500, letterSpacing: 1, color: '#e0e0dc' } as React.CSSProperties,
  desc: { fontSize: 11, color: '#555', marginLeft: 8 } as React.CSSProperties,
  divider: { width: 1, height: 16, background: '#2a2a2a' } as React.CSSProperties,
  badgeAlert: { background: '#3a0000', color: '#FF6666', fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 8px', whiteSpace: 'nowrap' as const },
  badgeOk: { background: '#1a2e00', color: '#C8E000', fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 8px' } as React.CSSProperties,
  footer: { marginTop: 20, padding: '11px 14px', background: '#141414', borderRadius: 8, border: '0.5px solid #2a2a2a', fontSize: 12, color: '#555' } as React.CSSProperties,
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
    <div style={S.page}>
      <nav style={S.nav}>
        <span style={S.logo}><span style={S.logoGreen}>VE</span>PREX</span>
        <div style={S.navRight}>
          <span style={S.navMuted}>{CONJUNTOS.length} conjuntos · {time}</span>
          <button style={S.btn}>+ Conjunto</button>
        </div>
      </nav>

      <div style={S.wrap}>
        <div style={S.statGrid}>
          {[
            { label: 'Conjuntos', value: CONJUNTOS.length, color: '#e0e0dc' },
            { label: 'Com alerta', value: alertas.length, color: '#FF4444' },
            { label: 'Normais', value: normais.length, color: '#C8E000' },
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={S.statLabel}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {alertas.length > 0 && (
          <>
            <div style={S.sectionLabel}>ALERTAS</div>
            {alertas.map(c => (
              <div key={c.id} style={S.cardAlert}>
                <div style={S.cardHeader}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div><span style={S.plate}>{c.cavalo.placa}</span><span style={S.desc}>{c.cavalo.desc}</span></div>
                    <div style={S.divider}/>
                    <div><span style={S.plate}>{c.carreta.placa}</span><span style={S.desc}>{c.carreta.desc}</span></div>
                  </div>
                  <span style={S.badgeAlert}>{c.alertas} alerta</span>
                </div>
                <div style={S.diagramWrap}><Diagrama p={c.pneus}/></div>
              </div>
            ))}
          </>
        )}

        {normais.length > 0 && (
          <>
            <div style={S.sectionLabel}>NORMAIS</div>
            {normais.map(c => (
              <div key={c.id} style={S.cardOk}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div><span style={S.plate}>{c.cavalo.placa}</span><span style={S.desc}>{c.cavalo.desc}</span></div>
                  <div style={{ ...S.divider, height: 14 }}/>
                  <div><span style={S.plate}>{c.carreta.placa}</span><span style={S.desc}>{c.carreta.desc}</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#555' }}>114 – 120 PSI · 14 pneus</span>
                  <span style={S.badgeOk}>Normal</span>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={S.footer}>🔌 Dados de demonstração — aguardando conexão com API Carqseng</div>
      </div>
    </div>
  )
}
