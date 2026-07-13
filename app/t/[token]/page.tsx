'use client'
import { useState, useEffect } from 'react'

const G = '#C8E000'
const RED = '#FF3333'

function Tire({ x, y, w, h, psi, min = 100 }: { x: number; y: number; w: number; h: number; psi: number | null; min?: number }) {
  const alert = psi !== null && psi < min
  const offline = psi === null
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2}
        fill={offline ? '#1a1a1a' : alert ? '#3a0000' : '#1a2e00'}
        stroke={offline ? '#333' : alert ? RED : G}
        strokeWidth={alert ? 1.8 : 1.5}/>
      <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle"
        fontFamily="monospace" fontSize={9} fontWeight="bold"
        fill={offline ? '#444' : alert ? '#FF4444' : G}>
        {psi !== null ? `${psi}` : '—'}
      </text>
    </g>
  )
}

function DiagramaCavalo({ pneus }: { pneus: any[] }) {
  const get = (n: number) => pneus.find(p => p.tire_num === n)?.psi ?? null
  return (
    <svg width="100%" viewBox="0 0 360 130">
      <rect x="6" y="35" width="55" height="60" rx="5" fill="none" stroke={G} strokeWidth="1.5"/>
      <rect x="12" y="43" width="30" height="26" rx="2" fill="none" stroke="#8a9900" strokeWidth="1"/>
      <line x1="61" y1="52" x2="340" y2="52" stroke={G} strokeWidth="1.5"/>
      <line x1="61" y1="78" x2="340" y2="78" stroke={G} strokeWidth="1.5"/>
      <line x1="120" y1="43" x2="120" y2="87" stroke={G} strokeWidth="1.5"/>
      <Tire x={96} y={22} w={48} h={19} psi={get(1)}/>
      <Tire x={96} y={89} w={48} h={19} psi={get(2)}/>
      <text x="120" y="120" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo 1</text>
      <line x1="285" y1="43" x2="285" y2="87" stroke={G} strokeWidth="1.5"/>
      <Tire x={261} y={14} w={48} h={17} psi={get(3)}/>
      <Tire x={261} y={33} w={48} h={17} psi={get(4)}/>
      <Tire x={261} y={80} w={48} h={17} psi={get(5)}/>
      <Tire x={261} y={99} w={48} h={17} psi={get(6)}/>
      <text x="285" y="125" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo 2</text>
      <text x="6" y="12" fontFamily="sans-serif" fontSize={7} fill="#444">esq.</text>
      <text x="6" y="128" fontFamily="sans-serif" fontSize={7} fill="#444">dir.</text>
    </svg>
  )
}

function DiagramaCarreta({ pneus, eixos = 3 }: { pneus: any[]; eixos?: number }) {
  const get = (n: number) => pneus.find(p => p.tire_num === n)?.psi ?? null
  const axleX = eixos === 2 ? [120, 250] : [100, 200, 300]
  return (
    <svg width="100%" viewBox="0 0 360 130">
      <rect x="4" y="58" width="8" height="18" rx="2" fill={G}/>
      <line x1="12" y1="52" x2="350" y2="52" stroke={G} strokeWidth="1.5"/>
      <line x1="12" y1="78" x2="350" y2="78" stroke={G} strokeWidth="1.5"/>
      <line x1="350" y1="52" x2="350" y2="78" stroke={G} strokeWidth="1.5"/>
      {axleX.map((ax, i) => {
        const base = i * 4
        return (
          <g key={i}>
            <line x1={ax} y1="43" x2={ax} y2="87" stroke={G} strokeWidth="1.5"/>
            <Tire x={ax - 24} y={14} w={48} h={17} psi={get(base + 1)}/>
            <Tire x={ax - 24} y={33} w={48} h={17} psi={get(base + 2)}/>
            <Tire x={ax - 24} y={80} w={48} h={17} psi={get(base + 3)}/>
            <Tire x={ax - 24} y={99} w={48} h={17} psi={get(base + 4)}/>
            <text x={ax} y="125" textAnchor="middle" fontFamily="sans-serif" fontSize={8} fill="#555">Eixo {i + 1}</text>
          </g>
        )
      })}
      <text x="6" y="12" fontFamily="sans-serif" fontSize={7} fill="#444">esq.</text>
      <text x="6" y="128" fontFamily="sans-serif" fontSize={7} fill="#444">dir.</text>
    </svg>
  )
}

export default function QRPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState('')

  const fetchData = async () => {
    try {
      const res = await fetch('/api/live', { cache: 'no-store' })
      const json = await res.json()
      if (json.ok) {
        const veiculo = json.conjuntos?.find((c: any) =>
          c.placa === params.token ||
          c.id === params.token ||
          c.device_sn === params.token
        )
        setData({ veiculo, raw: json })
        setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
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

  const veiculo = data?.veiculo
  const isCavalo = params.token?.includes('cavalo') || (!params.token?.includes('carreta') && veiculo?.type !== 'trailer')

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: 'system-ui, sans-serif', color: '#e0e0dc' }}>
      <nav style={{ background: '#141414', borderBottom: '0.5px solid #2a2a2a', padding: '0 16px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 500 }}><span style={{ color: G }}>VE</span>PREX</span>
        {veiculo && (
          <span style={{
            background: veiculo.online ? '#1a2e00' : '#1a1a1a',
            color: veiculo.online ? G : '#555',
            fontSize: 10, fontWeight: 500, borderRadius: 20,
            padding: '2px 8px', border: `0.5px solid ${veiculo.online ? G : '#2a2a2a'}`
          }}>
            {veiculo.online ? '● Online' : '○ Offline'}
          </span>
        )}
      </nav>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>Carregando...</div>
        ) : !veiculo ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div>Veículo não encontrado</div>
            <div style={{ fontSize: 11, color: '#333', marginTop: 6 }}>Token: {params.token}</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, marginBottom: 4 }}>
                {isCavalo ? 'CAVALO MECÂNICO' : 'CARRETA'}
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: 2 }}>{veiculo.placa || 'Veículo'}</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>SN: {veiculo.device_sn} · {veiculo.pneus?.length || 0} pneus · Atualizado {time}</div>
            </div>

            {veiculo.hasAlert && veiculo.alertas?.map((a: any, i: number) => (
              <div key={i} style={{ background: '#1a0000', border: '0.5px solid #7a2020', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: '#FF6666', letterSpacing: '0.5px', marginBottom: 2 }}>⚠ AÇÃO IMEDIATA</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#FF4444' }}>Pressão crítica — {a.location}</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: '#FF4444', lineHeight: 1.2 }}>{a.value} <span style={{ fontSize: 12, color: '#FF6666' }}>PSI</span></div>
                <div style={{ fontSize: 11, color: '#AA4444', marginTop: 2 }}>↓ {Math.abs(a.delta)} PSI abaixo do mínimo</div>
              </div>
            ))}

            <div style={{ background: '#0a0a0a', borderRadius: 10, padding: '14px 10px', marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: '#444', letterSpacing: 1, marginBottom: 8 }}>POSICIONAMENTO DOS PNEUS</div>
              {isCavalo
                ? <DiagramaCavalo pneus={veiculo.pneus || []}/>
                : <DiagramaCarreta pneus={veiculo.pneus || []} eixos={3}/>
              }
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              {[['#1a2e00', G, 'Normal'], ['#3a0000', RED, 'Alerta'], ['#1a1a1a', '#444', 'Sem sinal']].map(([bg, border, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 14, height: 8, background: bg, border: `0.5px solid ${border}`, borderRadius: 2 }}/>
                  <span style={{ fontSize: 10, color: '#555' }}>{label}</span>
                </div>
              ))}
            </div>

            {veiculo.hasAlert && (
              <div style={{ background: '#0c1a0c', border: '0.5px solid #1e3a1e', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: G, marginBottom: 8 }}>⚡ Agente VEPREX</div>
                <div style={{ fontSize: 12, color: '#d0d0cc', lineHeight: 1.5, marginBottom: 6 }}>
                  Pressão crítica detectada. Evite continuar rodando nessa condição.
                </div>
                <div style={{ fontSize: 12, color: G, fontWeight: 500 }}>→ Calibrar na próxima parada segura.</div>
              </div>
            )}

            {!veiculo.hasAlert && (
              <div style={{ background: '#0f200f', border: '0.5px solid #1e3a1e', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: G, fontWeight: 500 }}>✓ Todos os pneus dentro da pressão ideal</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>Continue monitorando. Próxima verificação automática em 30s.</div>
              </div>
            )}

            <div style={{ fontSize: 10, color: '#333', textAlign: 'center', padding: '8px 0' }}>
              Atualizado em tempo real · veprex.vercel.app/t/{params.token}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
