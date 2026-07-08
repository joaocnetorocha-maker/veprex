'use client'
import { useState, useEffect } from 'react'

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
    explanation: 'Pressão crítica detectada em um dos pneus. Recomenda-se priorizar a correção antes de retomar a viagem.',
    impacts: [
      'pode aumentar o consumo de combustível',
      'tende a acelerar o desgaste irregular da banda de rodagem',
      'há maior risco de dano estrutural ao pneu',
    ],
    recommendation: 'Evite continuar rodando nessa condição. Minha recomendação é calibrar o pneu na próxima parada segura.',
    messageTemplate: (placa, _, value, location) =>
      `⚠️ VEPREX\nVeículo: ${placa}\n\nProblema detectado:\nPressão crítica no ${location}.\nPressão atual: ${value} PSI.\n\nEvite continuar rodando nessa condição. Recomenda-se calibrar o pneu na próxima parada segura.\n\nApós realizar a correção, responda esta mensagem para confirmação.`,
  },
  high_temp: {
    id: 'high_temp', severity: 'high', emoji: '🟠',
    title: 'Temperatura elevada detectada',
    urgencyLabel: 'AÇÃO NECESSÁRIA',
    explanation: 'Temperatura elevada detectada em um dos pneus. Caso a viagem continue nessa condição, o risco de falha tende a aumentar.',
    impacts: [
      'há maior risco de falha estrutural do pneu',
      'pode indicar problema no sistema de freios',
      'tende a reduzir a vida útil do pneu',
    ],
    recommendation: 'Recomenda-se reduzir a velocidade e parar em local seguro para inspeção antes de continuar a viagem.',
    messageTemplate: (placa, _, value, location) =>
      `⚠️ VEPREX\nVeículo: ${placa}\n\nProblema detectado:\nTemperatura elevada no ${location}.\nTemperatura atual: ${value}°C.\n\nRecomenda-se reduzir a velocidade e parar em local seguro para inspeção.\n\nApós verificar, responda esta mensagem para confirmação.`,
  },
}

const G = '#C8E000'
const RED = '#FF3333'

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

function AgenteVeprex({ alerta, placa }: { alerta: any; placa: string }) {
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const type = ALERT_TYPES[alerta.type]
  if (!type) return null
  const msg = type.messageTemplate(placa, '', alerta.value, alerta.location)
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

function TireGrid({ pneus }: { pneus: any[] }) {
  if (!pneus || pneus.length === 0) return null
  return (
    <div style={{ margin: '0 14px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {pneus.map((p, i) => {
        const hasData = p.psi !== null
        const alert = hasData && p.psi < 100
        return (
          <div key={i} style={{
            background: alert ? '#1a0000' : '#0f0f0f',
            border: `0.5px solid ${alert ? '#7a2020' : '#2a2a2a'}`,
            borderRadius: 8, padding: '10px 12px'
          }}>
            <div style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>Pneu {p.tire_num}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: alert ? '#FF4444' : hasData ? G : '#444' }}>
              {hasData ? `${p.psi}` : '—'}
              <span style={{ fontSize: 11, marginLeft: 2, color: alert ? '#FF6666' : '#666' }}>PSI</span>
            </div>
            {p.temp !== null && (
              <div style={{ fontSize: 11, color: p.temp > 80 ? '#FF6666' : '#555', marginTop: 2 }}>{p.temp}°C</div>
            )}
            <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{p.battery}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('')

  const fetchData = async () => {
    try {
      const res = await fetch('/api/live')
      const json = await res.json()
      if (json.ok) {
        setData(json)
        setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const t = setInterval(fetchData, 30000)
    return () => clearInterval(t)
  }, [])

  const conjuntos = data?.conjuntos || []
  const alertas = conjuntos.filter((c: any) => c.hasAlert)
  const normais = conjuntos.filter((c: any) => !c.hasAlert)
  const online = conjuntos.filter((c: any) => c.online)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: 'system-ui, sans-serif', color: '#e0e0dc' }}>
      <nav style={{ background: '#141414', borderBottom: '0.5px solid #2a2a2a', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 17, fontWeight: 500 }}><span style={{ color: G }}>VE</span>PREX</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12, color: '#555' }}>
            {loading ? 'Carregando...' : `${conjuntos.length} veículo${conjuntos.length !== 1 ? 's' : ''} · ${lastUpdate}`}
          </span>
          <button onClick={fetchData} style={{ fontSize: 12, fontWeight: 500, background: '#1a2e00', color: G, border: `0.5px solid ${G}`, borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>↻ Atualizar</button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>Conectando com a API...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Monitorados', value: conjuntos.length, color: '#e0e0dc', border: '#2a2a2a' },
                { label: 'Online', value: online.length, color: G, border: online.length > 0 ? '#2a4a2a' : '#2a2a2a' },
                { label: 'Com alerta', value: alertas.length, color: alertas.length > 0 ? '#FF4444' : '#e0e0dc', border: alertas.length > 0 ? '#5a1a1a' : '#2a2a2a' },
                { label: 'Normais', value: normais.length, color: '#e0e0dc', border: '#2a2a2a' },
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
                {alertas.map((c: any) => (
                  <div key={c.id} style={{ background: '#141414', border: '0.5px solid #5a1a1a', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1 }}>{c.placa}</span>
                        <span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>SN: {c.device_sn}</span>
                      </div>
                      <span style={{ background: '#3a0000', color: '#FF6666', fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 10px' }}>{c.alertas.length} alerta</span>
                    </div>
                    {c.alertas.map((a: any, i: number) => {
                      const type = ALERT_TYPES[a.type]
                      return (
                        <div key={i} style={{ margin: '0 14px 12px', background: '#1a0000', border: '0.5px solid #7a2020', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ fontSize: 28 }}>{type?.emoji}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 500, color: '#FF6666', letterSpacing: 1, marginBottom: 1 }}>{type?.urgencyLabel}</div>
                            <div style={{ fontSize: 16, fontWeight: 500, color: '#FF4444', marginBottom: 4 }}>{type?.title}</div>
                            <div style={{ fontSize: 32, fontWeight: 500, color: '#FF4444', lineHeight: 1 }}>{a.value} <span style={{ fontSize: 14, color: '#FF6666' }}>PSI</span></div>
                            <div style={{ fontSize: 12, color: '#AA4444', marginTop: 3 }}>↓ {Math.abs(a.delta)} PSI abaixo do mínimo · {a.location}</div>
                          </div>
                        </div>
                      )
                    })}
                    <TireGrid pneus={c.pneus} />
                    {c.alertas.map((a: any, i: number) => (
                      <AgenteVeprex key={i} alerta={a} placa={c.placa} />
                    ))}
                  </div>
                ))}
              </>
            )}

            {normais.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#555', letterSpacing: '0.5px', marginBottom: 10 }}>
                  {alertas.length > 0 ? 'NORMAIS' : 'VEÍCULOS'}
                </div>
                {normais.map((c: any) => (
                  <div key={c.id} style={{ background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1 }}>{c.placa || 'Amostra'}</span>
                        <span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>SN: {c.device_sn}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, color: '#555' }}>{c.pneus.length} pneus</span>
                        <span style={{
                          background: c.online ? '#1a2e00' : '#1a1a1a',
                          color: c.online ? G : '#555',
                          fontSize: 10, fontWeight: 500, borderRadius: 20, padding: '3px 8px',
                          border: `0.5px solid ${c.online ? '#2a4a2a' : '#2a2a2a'}`
                        }}>
                          {c.online ? '● Online' : '○ Offline — aguardando chip'}
                        </span>
                      </div>
                    </div>
                    {!c.online && (
                      <div style={{ padding: '0 16px 12px', fontSize: 12, color: '#444' }}>
                        Instale o chip SIM M2M para ativar o monitoramento em tempo real.
                      </div>
                    )}
                    {c.online && <TireGrid pneus={c.pneus} />}
                  </div>
                ))}
              </>
            )}

            <div style={{ marginTop: 20, padding: '11px 14px', background: '#141414', borderRadius: 8, border: '0.5px solid #2a2a2a', fontSize: 12, color: '#555', display: 'flex', justifyContent: 'space-between' }}>
              <span>🔌 Conectado à API Carqseng via cheyueda.com · Atualização automática a cada 30s</span>
              <span style={{ color: '#333' }}>SN {data?.raw?.vehicles?.[0]?.device_serial_number}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
