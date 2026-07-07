'use client'
import { useState } from 'react'

interface AlertType {
  id: string
  severity: 'critical' | 'high'
  title: string
  urgencyLabel: string
  emoji: string
  explanation: string
  impacts: string[]
  recommendation: string
  messageTemplate: (cavalo: string, carreta: string, value: number, location: string) => string
}

const ALERT_TYPES: Record<string, AlertType> = {
  low_psi: {
    id: 'low_psi', severity: 'critical', emoji: '🔴',
    title: 'Pressão crítica detectada',
    urgencyLabel: 'AÇÃO IMEDIATA NECESSÁRIA',
    explanation: 'Pressão crítica detectada no pneu externo do eixo 3 da carreta. Recomenda-se priorizar a correção antes de retomar a viagem.',
    impacts: [
      'pode aumentar o consumo de combustível',
      'tende a acelerar o desgaste irregular da banda de rodagem',
      'há maior risco de dano estrutural ao pneu',
    ],
    recommendation: 'Evite continuar rodando nessa condição. Minha recomendação é calibrar o pneu na próxima parada segura.',
    messageTemplate: (cavalo, carreta, value, location) =>
      `⚠️ VEPREX\nVeículo: ${cavalo}\nCarreta: ${carreta}\n\nProblema detectado:\nPressão crítica no pneu ${location}.\nPressão atual: ${value} PSI.\n\nEvite continuar rodando nessa condição. Recomenda-se calibrar o pneu na próxima parada segura.\n\nApós realizar a correção, responda esta mensagem para confirmação.`,
  },
  high_temp: {
    id: 'high_temp', severity: 'high', emoji: '🟠',
    title: 'Temperatura elevada detectada',
    urgencyLabel: 'AÇÃO NECESSÁRIA',
    explanation: 'Temperatura elevada detectada em um dos pneus da carreta. Caso a viagem continue nessa condição, o risco de falha tende a aumentar.',
    impacts: [
      'há maior risco de falha estrutural do pneu',
      'pode indicar problema no sistema de freios',
      'tende a reduzir a vida útil do pneu',
    ],
    recommendation: 'Recomenda-se reduzir a velocidade e parar em local seguro para inspeção antes de continuar a viagem.',
    messageTemplate: (cavalo, carreta, value, location) =>
      `⚠️ VEPREX\nVeículo: ${cavalo}\nCarreta: ${carreta}\n\nProblema detectado:\nTemperatura elevada no pneu ${location}.\nTemperatura atual: ${value}°C.\n\nRecomenda-se reduzir a velocidade e parar em local seguro para inspeção.\n\nApós verificar, responda esta mensagem para confirmação.`,
  },
}

const CONJUNTOS = [
  {
    id: '1',
    cavalo: { placa: 'ABC-1234', desc: 'Scania R450' },
    carreta: { placa: 'XYZ-5678', desc: 'Randon 3 eixos' },
    alertas: [{ type: 'low_psi', value: 84, location: 'externo do eixo 3', delta: -16 }],
    pneus: {
      e1_esq: 116, e1_dir: 114,
      e2_ee: 118, e2_ei: 117, e2_di: 119, e2_de: 116,
      e3_ee: 84, e3_ei: 117, e3_di: 118, e3_de: 116,
      e4_ee: 119, e4_ei: 117, e4_di: 118, e4_de: 116,
      e5_ee: 117, e5_ei: 118, e5_di: 119, e5_de: 116,
    }
  },
  {
    id: '2',
    cavalo: { placa: 'DEF-9012', desc: 'Volvo FH' },
    carreta: { placa: 'GHI-3456', desc: 'Randon 2 eixos' },
    alertas: [],
    pneus: null
  }
]

const G = '#C8E000'
const RED = '#FF3333'

function Tire({ x, y, w, h, psi, min = 100 }: { x: number; y: number; w: number; h: number; psi: number; min?: number }) {
  const alert = psi < min
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={alert ? '#3a0000' : '#1a2e00'} stroke={alert ? RED : G} strokeWidth={alert ? 1.8 : 1.5} />
      <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle" fontFamily="monospace" fontSize={9} fontWeight="bold" fill={alert ? '#FF4444' : G}>{psi}</text>
    </g>
  )
}

function Diagrama({ p }: { p: typeof CONJUNTOS[0]['pneus'] }) {
  if (!p) return null
  return (
    <svg width="100%" viewBox="0 0 680 130">
      <rect x="8" y="38" width="52" height="54" rx="5" fill="none" stroke={G} strokeWidth="1.5" />
      <rect x="14" y="45" width="28" height="22" rx="2" fill="none" stroke="#8a9900" strokeWidth="1" />
      <line x1="60" y1="52" x2="210" y2="52" stroke={G} strokeWidth="1.5" />
      <line x1="60" y1="78" x2="210" y2="78" stroke={G} strokeWidth="1.5" />
      <line x1="108" y1="44" x2="108" y2="86" stroke={G} strokeWidth="1.5" />
      <Tire x={88} y={26} w={40} h={16} psi={p.e1_esq} /><Tire x={88} y={88} w={40} h={16} psi={p.e1_dir} />
      <text x="108" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 1</text>
      <line x1="188" y1="44" x2="188" y2="86" stroke={G} strokeWidth="1.5" />
      <Tire x={168} y={22} w={40} h={14} psi={p.e2_ee} /><Tire x={168} y={38} w={40} h={14} psi={p.e2_ei} />
      <Tire x={168} y={78} w={40} h={14} psi={p.e2_di} /><Tire x={168} y={94} w={40} h={14} psi={p.e2_de} />
      <text x="188" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 2</text>
      <line x1="210" y1="65" x2="238" y2="65" stroke="#666" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="224" cy="65" r="5" fill="none" stroke="#666" strokeWidth="1.5" />
      <rect x="238" y="58" width="8" height="14" rx="2" fill={G} />
      <line x1="246" y1="52" x2="665" y2="52" stroke={G} strokeWidth="1.5" />
      <line x1="246" y1="78" x2="665" y2="78" stroke={G} strokeWidth="1.5" />
      <line x1="665" y1="52" x2="665" y2="78" stroke={G} strokeWidth="1.5" />
      <line x1="360" y1="44" x2="360" y2="86" stroke={G} strokeWidth="1.5" />
      <Tire x={340} y={22} w={40} h={14} psi={p.e3_ee} /><Tire x={340} y={38} w={40} h={14} psi={p.e3_ei} />
      <Tire x={340} y={78} w={40} h={14} psi={p.e3_di} /><Tire x={340} y={94} w={40} h={14} psi={p.e3_de} />
      <text x="360" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 3</text>
      <line x1="490" y1="44" x2="490" y2="86" stroke={G} strokeWidth="1.5" />
      <Tire x={470} y={22} w={40} h={14} psi={p.e4_ee} /><Tire x={470} y={38} w={40} h={14} psi={p.e4_ei} />
      <Tire x={470} y={78} w={40} h={14} psi={p.e4_di} /><Tire x={470} y={94} w={40} h={14} psi={p.e4_de} />
      <text x="490" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 4</text>
      <line x1="620" y1="44" x2="620" y2="86" stroke={G} strokeWidth="1.5" />
      <Tire x={600} y={22} w={40} h={14} psi={p.e5_ee} /><Tire x={600} y={38} w={40} h={14} psi={p.e5_ei} />
      <Tire x={600} y={78} w={40} h={14} psi={p.e5_di} /><Tire x={600} y={94} w={40} h={14} psi={p.e5_de} />
      <text x="620" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#666">Eixo 5</text>
      <text x="108" y="9" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">CAVALO</text>
      <line x1="68" y1="12" x2="148" y2="12" stroke="#555" strokeWidth="0.5" />
      <text x="454" y="9" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">CARRETA</text>
      <line x1="260" y1="12" x2="648" y2="12" stroke="#555" strokeWidth="0.5" />
    </svg>
  )
}

function Modal({ msg, onClose }: { msg: string; onClose: () => void }) {
  const [text, setText] = useState(msg)
  const handleSend = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    onClose()
  }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 600, padding: '24px 24px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#e0e0dc' }}>Enviar orientação ao motorista</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} style={{ width: '100%', background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: 8, padding: 14, fontSize: 13, color: '#d0d0cc', lineHeight: 1.6, resize: 'vertical', minHeight: 180, boxSizing: 'border-box', fontFamily: 'system-ui,sans-serif' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onClose} style={{ flex: 1, background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: 8, padding: '11px 0', fontSize: 12, color: '#c0c0bc', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSend} style={{ flex: 2, background: '#1a2e00', border: `0.5px solid ${G}`, borderRadius: 8, padding: '11px 0', fontSize: 13, color: G, fontWeight: 500, cursor: 'pointer' }}>Enviar via WhatsApp</button>
        </div>
      </div>
    </div>
  )
}

function AgenteVeprex({ alerta, cavalo, carreta }: { alerta: { type: string; value: number; location: string; delta: number }; cavalo: string; carreta: string }) {
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const type = ALERT_TYPES[alerta.type]
  if (!type) return null
  const msg = type.messageTemplate(cavalo, carreta, alerta.value, alerta.location)
  const handleCopy = () => { navigator.clipboard.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <>
      {showModal && <Modal msg={msg} onClose={() => setShowModal(false)} />}
      <div style={{ margin: '0 14px 12px', background: '#0c1a0c', border: '0.5px solid #1e3a1e', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ background: '#0f200f', padding: '10px 14px', borderBottom: '0.5px solid #1e3a1e', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: G }}>Agente VEPREX</span>
          <span style={{ marginLeft: 6, background: '#3a0000', border: '0.5px solid #7a2020', color: '#FF6666', fontSize: 10, fontWeight: 500, borderRadius: 4, padding: '2px 8px' }}>🔴 Prioridade Alta</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#666', letterSpacing: '0.5px', marginBottom: 6, textTransform: 'uppercase' as const }}>O que aconteceu</div>
            <div style={{ fontSize: 13, color: '#d0d0cc', lineHeight: 1.6 }}>{type.explanation}</div>
          </div>
          <div style={{ height: '0.5px', background: '#1e3a1e' }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#FF6666', letterSpacing: '0.5px', marginBottom: 8, textTransform: 'uppercase' as const }}>Se continuar rodando nessa condição</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {type.impacts.map((impact, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: G, fontSize: 11, marginTop: 2 }}>•</span>
                  <span style={{ fontSize: 13, color: '#d0d0cc', lineHeight: 1.4 }}>{impact}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '0.5px', background: '#1e3a1e' }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#666', letterSpacing: '0.5px', marginBottom: 6, textTransform: 'uppercase' as const }}>O que fazer</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: G, fontSize: 13, marginTop: 1 }}>→</span>
              <span style={{ fontSize: 13, color: G, fontWeight: 500, lineHeight: 1.5 }}>{type.recommendation}</span>
            </div>
          </div>
        </div>
        <div style={{ margin: '0 14px 14px', display: 'flex', gap: 8 }}>
          <button onClick={handleCopy} style={{ flex: 1, background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: 8, padding: '10px 0', fontSize: 12, color: copied ? G : '#c0c0bc', cursor: 'pointer' }}>
            {copied ? '✓ Copiado' : 'Copiar comunicado'}
          </button>
          <button onClick={() => setShowModal(true)} style={{ flex: 1, background: '#1a2e00', border: `0.5px solid ${G}`, borderRadius: 8, padding: '10px 0', fontSize: 12, color: G, fontWeight: 500, cursor: 'pointer' }}>
            Enviar ao motorista
          </button>
        </div>
      </div>
    </>
  )
}

export default function Dashboard() {
  const alertas = CONJUNTOS.filter(c => c.alertas.length > 0)
  const normais = CONJUNTOS.filter(c => c.alertas.length === 0)
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: 'system-ui, sans-serif', color: '#e0e0dc' }}>
      <nav style={{ background: '#141414', borderBottom: '0.5px solid #2a2a2a', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 17, fontWeight: 500 }}><span style={{ color: G }}>VE</span>PREX</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12, color: '#555' }}>{CONJUNTOS.length} conjuntos</span>
          <button style={{ fontSize: 12, fontWeight: 500, background: '#1a2e00', color: G, border: `0.5px solid ${G}`, borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>+ Conjunto</button>
        </div>
      </nav>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Conjuntos', value: CONJUNTOS.length, color: '#e0e0dc', border: '#2a2a2a' },
            { label: 'Com alerta', value: alertas.length, color: '#FF4444', border: '#5a1a1a' },
            { label: 'Normais', value: normais.length, color: G, border: '#2a2a2a' },
          ].map(s => (
            <div key={s.label} style={{ background: '#141414', border: `0.5px solid ${s.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        {alertas.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#555', letterSpacing: '0.5px', marginBottom: 12 }}>ALERTAS</div>
            {alertas.map(c => (
              <div key={c.id} style={{ background: '#141414', border: '0.5px solid #5a1a1a', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div><span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1 }}>{c.cavalo.placa}</span><span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>{c.cavalo.desc}</span></div>
                    <div style={{ width: 1, height: 16, background: '#2a2a2a' }} />
                    <div><span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1 }}>{c.carreta.placa}</span><span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>{c.carreta.desc}</span></div>
                  </div>
                  <span style={{ background: '#3a0000', color: '#FF6666', fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 10px' }}>{c.alertas.length} alerta</span>
                </div>
                {c.alertas.map((a, i) => {
                  const type = ALERT_TYPES[a.type]
                  return (
                    <div key={i} style={{ margin: '0 14px 12px', background: '#1a0000', border: '0.5px solid #7a2020', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ fontSize: 28 }}>{type?.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 500, color: '#FF6666', letterSpacing: 1, marginBottom: 1 }}>{type?.urgencyLabel}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, color: '#FF4444', marginBottom: 4 }}>{type?.title}</div>
                        <div style={{ fontSize: 32, fontWeight: 500, color: '#FF4444', lineHeight: 1 }}>{a.value} <span style={{ fontSize: 14, color: '#FF6666' }}>PSI</span></div>
                        <div style={{ fontSize: 12, color: '#AA4444', marginTop: 3 }}>↓ {Math.abs(a.delta)} PSI abaixo do mínimo recomendado · {a.location}</div>
                      </div>
                    </div>
                  )
                })}
                <div style={{ background: '#0a0a0a', margin: '0 14px 12px', borderRadius: 8, padding: '12px 10px' }}>
                  <Diagrama p={c.pneus} />
                </div>
                {c.alertas.map((a, i) => (
                  <AgenteVeprex key={i} alerta={a} cavalo={c.cavalo.placa} carreta={c.carreta.placa} />
                ))}
              </div>
            ))}
          </>
        )}
        {normais.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#555', letterSpacing: '0.5px', marginBottom: 10 }}>NORMAIS</div>
            {normais.map(c => (
              <div key={c.id} style={{ background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div><span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1 }}>{c.cavalo.placa}</span><span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>{c.cavalo.desc}</span></div>
                  <div style={{ width: 1, height: 14, background: '#2a2a2a' }} />
                  <div><span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1 }}>{c.carreta.placa}</span><span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>{c.carreta.desc}</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#555' }}>114 – 120 PSI · 14 pneus</span>
                  <span style={{ background: '#1a2e00', color: G, fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 8px' }}>Normal</span>
                </div>
              </div>
            ))}
          </>
        )}
        <div style={{ marginTop: 20, padding: '11px 14px', background: '#141414', borderRadius: 8, border: '0.5px solid #2a2a2a', fontSize: 12, color: '#555' }}>
          🔌 Dados de demonstração — aguardando conexão com API Carqseng
        </div>
      </div>
    </div>
  )
}
