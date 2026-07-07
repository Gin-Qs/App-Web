import { useState, type FormEvent } from 'react'
import { MagnifyingGlass, Package } from '@phosphor-icons/react'
import {
  formatDateTime,
  formatRelative,
  TRIP_STATUS_LABELS,
  tripStatusTone,
  trackShipment,
  type ShipmentTracking,
} from '@ginqs/core'
import { supabase } from '../lib/supabase'
import { SiteNav } from '../marketing/SiteNav'
import { SiteFooter } from '../marketing/SiteFooter'
import { whatsappWithMessage } from '../marketing/content'
import { Badge, Card, Chip, EmptyState } from '../components/ui'
import { LiveMap, type MapMarker } from '../components/LiveMap'

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'found'; data: ShipmentTracking }
  | { kind: 'empty' }
  | { kind: 'error' }

export function RastreoPage() {
  const [ref, setRef] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = ref.trim()
    if (!q) return
    setState({ kind: 'loading' })
    try {
      const data = await trackShipment(supabase, q)
      setState(data ? { kind: 'found', data } : { kind: 'empty' })
    } catch {
      setState({ kind: 'error' })
    }
  }

  const found = state.kind === 'found' ? state.data : null
  const markers: MapMarker[] =
    found && found.last_lat != null && found.last_lon != null
      ? [
          {
            id: 'now',
            lat: found.last_lat,
            lon: found.last_lon,
            label: `${found.reference}`,
            sublabel: `${found.origin_label ?? ''} → ${found.destination_label ?? ''}`,
            tone: tripStatusTone(found.status) as MapMarker['tone'],
          },
        ]
      : []

  return (
    <div className="landing">
      <SiteNav />

      <section className="track-page">
        <div className="track-page-head">
          <span className="eyebrow">Rastreo</span>
          <h1>Rastrea tu guía</h1>
          <p>
            ¿Hiciste un envío con nosotros sin cuenta en el portal? Escribe tu número de guía y ve el
            estatus en tiempo real.
          </p>
          <form className="track-search" onSubmit={onSubmit}>
            <div className="track-input">
              <MagnifyingGlass size={20} />
              <input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="Número de guía (ej. TR-8912)"
                aria-label="Número de guía"
              />
            </div>
            <button className="btn btn-primary btn-lg" type="submit">
              Rastrear
            </button>
          </form>
          <p className="track-hint">¿Cliente frecuente? <a href="/login">Entra a tu panel</a> para ver todo tu historial.</p>
        </div>

        <div className="track-result">
          {state.kind === 'loading' && <EmptyState>Buscando tu guía…</EmptyState>}
          {state.kind === 'empty' && (
            <Card>
              <EmptyState>
                No encontramos la guía <strong>{ref}</strong>. Revisa el número o{' '}
                <a
                  href={whatsappWithMessage(`Hola, necesito ayuda para rastrear mi guía ${ref}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  escríbenos por WhatsApp
                </a>{' '}
                y te ayudamos.
              </EmptyState>
            </Card>
          )}
          {state.kind === 'error' && (
            <Card>
              <EmptyState>Hubo un problema al consultar. Intenta de nuevo en un momento.</EmptyState>
            </Card>
          )}

          {found && (
            <>
              <Card
                title={`Guía ${found.reference}`}
                action={<Badge tone={tripStatusTone(found.status)}>{TRIP_STATUS_LABELS[found.status]}</Badge>}
              >
                <div className="track-facts">
                  <div>
                    <span className="track-fact-label">Ruta</span>
                    <span className="track-fact-value">
                      {found.origin_label ?? 'Sin dato'} → {found.destination_label ?? 'Sin dato'}
                    </span>
                  </div>
                  <div>
                    <span className="track-fact-label">Llegada estimada</span>
                    <span className="track-fact-value">{formatDateTime(found.eta)}</span>
                  </div>
                  {found.last_at && (
                    <div>
                      <span className="track-fact-label">Última posición</span>
                      <span className="track-fact-value">
                        {found.last_lat?.toFixed(3)}, {found.last_lon?.toFixed(3)} ·{' '}
                        {formatRelative(found.last_at)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="chips" style={{ marginTop: '0.6rem' }}>
                  <Chip online={found.status === 'in_transit'}>
                    {found.status === 'in_transit' ? 'EN RUTA' : TRIP_STATUS_LABELS[found.status]}
                  </Chip>
                  <Chip>GPS</Chip>
                </div>
              </Card>

              <Card title="Ubicación">
                {markers.length ? (
                  <LiveMap markers={markers} height={340} />
                ) : (
                  <EmptyState>Aún no hay posición GPS registrada para esta guía.</EmptyState>
                )}
              </Card>
            </>
          )}

          {state.kind === 'idle' && (
            <div className="track-placeholder">
              <Package size={40} weight="duotone" />
              <p>Escribe tu número de guía para ver el estatus de tu carga.</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
