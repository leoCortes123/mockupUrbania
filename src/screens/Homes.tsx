import { Link, useNavigate } from 'react-router-dom';
import {
  DoorOpen, Users, Package, NotebookPen, ShieldCheck, CalendarClock, BadgeCheck, Megaphone, FolderOpen,
  MessageSquareText, Wallet, ArrowRight, CloudCog, TrendingUp, Building2, Repeat2, LifeBuoy, Server, Wrench, ClipboardList,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { useToast } from '../components/ui/Toast';
import { KPIS, ORGANIZACIONES_SAAS, SOPORTE_TICKETS, PAQUETES, VISITANTES, NOTIFICACIONES, PAGOS_RECIENTES } from '../data/fixtures';
import { cop, copShort, todayLong } from '../lib/format';

/* ============ Inicio de portería (kiosko) ============ */
export function PorteriaHome() {
  const dentro = VISITANTES.filter(v => v.estado === 'Dentro').length;
  const paquetes = PAQUETES.filter(p => p.estado === 'Notificado').length;
  const tiles = [
    { to: '/registro-de-visitantes', label: 'Registrar visitante', icon: DoorOpen },
    { to: '/autorizaciones-de-ingreso', label: 'Validar autorización', icon: BadgeCheck },
    { to: '/registro-de-paquetes', label: `Paquetería (${paquetes} pend.)`, icon: Package },
    { to: '/novedades-de-porteria', label: 'Escribir en minuta', icon: NotebookPen },
    { to: '/control-de-rondas', label: 'Marcar ronda', icon: ShieldCheck },
    { to: '/registro-de-accesos', label: 'Consultar accesos', icon: ClipboardList },
    { to: '/directorio-de-residentes', label: 'Buscar residente', icon: Users },
  ];
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 22 }}>Buenos días, Turno A</h1>
          <p style={{ color: '#8aa0ad', margin: '2px 0 0' }}>{todayLong()} · {dentro} personas dentro · {paquetes} paquetes pendientes</p>
        </div>
      </div>
      <nav className="porteria-grid" aria-label="Operaciones frecuentes">
        {tiles.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="porteria-tile"><Icon size={34} strokeWidth={1.6} />{label}</Link>
        ))}
      </nav>
      <div className="porteria-card" style={{ marginTop: 14 }}>
        <h2><NotebookPen size={18} color="#ffd98a" /> Novedades de su turno</h2>
        <div className="porteria-list-row"><span className="badge-porteria">Incidente</span><div><b style={{ color: '#fff' }}>Ruido en 1105 — reportado por 1103-A, sin respuesta. SLA del consejo.</b><br /><span style={{ color: '#8aa0ad' }}>Hoy 08:40 · pendiente seguimiento</span></div></div>
        <div className="porteria-list-row"><span className="badge-porteria">Control</span><div><b style={{ color: '#fff' }}>Ronda 06:00 completada · punto 9 (sótano) con luz fundida → OT-2026-0145</b><br /><span style={{ color: '#8aa0ad' }}>Hoy 06:31</span></div></div>
      </div>
    </div>
  );
}

/* ============ Mi cuenta — Portal del residente ============ */
export function ResidentHome() {
  const { toast } = useToast();
  return (
    <>
      <div className="resident-hero">
        <div>
          <small>Estado de cuenta · Apto 501-A</small>
          <div><b>{cop(1_424_000)}</b></div>
          <span style={{ color: '#ffe9b0', fontSize: 11.5 }}>Vence el 15 de nov · 2 obligaciones pendientes (Nov-2026)</span>
        </div>
        <div className="hero-sep" />
        <div>
          <small>Próximo vencimiento</small>
          <div style={{ fontWeight: 800, fontSize: 19 }}>15 nov 2026</div>
          <span style={{ color: '#bfe0d6', fontSize: 11.5 }}>Administración + parqueadero visitantes</span>
        </div>
        <button className="porteria-btn" style={{ width: 'auto', padding: '0 26px', marginLeft: 'auto', background: '#ffd98a', color: '#3a2b0a' }} onClick={() => toast('ok', 'Pago simulado', 'Redirigiendo a PSE… (prototipo, sin transacción real)')}>Pagar ahora →</button>
      </div>

      <div className="resident-grid" style={{ marginBottom: 14 }}>
        {[
          { label: 'Mis PQRS', value: '2 en trámite', to: '/bandeja-de-solicitudes', icon: MessageSquareText },
          { label: 'Reservas', value: 'BBQ 15-nov · pendiente', to: '/calendario-de-reservas', icon: CalendarClock },
          { label: 'Paquetes', value: '1 por recoger', to: '/registro-de-paquetes', icon: Package },
          { label: 'Visitantes', value: '4 autorizados hoy', to: '/registro-de-visitantes', icon: DoorOpen },
        ].map(({ label, value, to, icon: Icon }) => (
          <Link key={to} to={to} className="resident-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Icon size={22} color="var(--brand)" />
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .6 }}>{label}</div>
            <b style={{ fontSize: 13 }}>{value}</b>
          </Link>
        ))}
      </div>

      <div className="resident-grid" style={{ gridTemplateColumns: '1.35fr 1fr' }}>
        <div className="resident-card">
          <h3><Wallet size={14} /> Mis últimos pagos</h3>
          {PAGOS_RECIENTES.slice(0, 3).map(p => (
            <div className="list-row" key={p.id} style={{ padding: '8px 2px' }}>
              <span className="mono cell-sub" style={{ width: 84 }}>{p.fecha.slice(5, 10)}</span>
              <div style={{ minWidth: 0 }}>{p.concepto}<div className="cell-sub">{p.medio}</div></div>
              <b className="mono" style={{ marginLeft: 'auto' }}>{cop(p.valor)}</b>
            </div>
          ))}
          <Link to="/cartelera-digital" style={{ fontSize: 11.5, color: 'var(--brand)', textDecoration: 'none', fontWeight: 700 }}>Ver historial completo →</Link>
        </div>
        <div className="resident-card">
          <h3><Megaphone size={14} /> Comunicados para ti</h3>
          {NOTIFICACIONES.slice(0, 3).map(n => (
            <div className="list-row" key={n.id} style={{ padding: '8px 2px' }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: n.tipo === 'ok' ? 'var(--ok)' : n.tipo === 'warn' ? '#d97706' : 'var(--info)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}><b style={{ fontSize: 12 }}>{n.titulo}</b><div className="cell-sub">{n.tiempo}</div></div>
            </div>
          ))}
          <Link to="/cartelera-digital" style={{ fontSize: 11.5, color: 'var(--brand)', textDecoration: 'none', fontWeight: 700 }}>Ir a la cartelera →</Link>
        </div>
      </div>

      <div className="resident-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 14 }}>
        <div className="resident-card">
          <h3><FolderOpen size={14} /> Documentos frecuentes</h3>
          {['Reglamento de PH v7', 'Manual de convivencia', 'Estado de resultados 2025', 'Póliza de la copropiedad'].map(d => <div className="list-row" key={d} style={{ padding: '7px 2px' }}><FolderOpen size={14} color="var(--brand)" /><span style={{ fontSize: 12 }}>{d}</span></div>)}
        </div>
        <div className="resident-card">
          <h3>Accesos directos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['Autorizar visita', '/autorizaciones-de-ingreso'], ['Reportar daño', '/bandeja-de-solicitudes'], ['Reservar BBQ', '/calendario-de-reservas'], ['Ver documentos', '/biblioteca-documental']].map(([l, to]) => (
              <Link key={to as string} to={to as string} className="btn" style={{ justifyContent: 'center', height: 46 }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Resumen de plataforma (Superadministrador) ============ */
export function SaasHome() {
  const activas = ORGANIZACIONES_SAAS.filter(o => o.estado === 'Activa').length;
  const mrr = ORGANIZACIONES_SAAS.filter(o => o.estado === 'Activa').reduce((a, o) => a + o.mrr, 0);
  const navigate = useNavigate();
  return (
    <>
      <div className="page-head"><div><h1>Resumen de plataforma</h1><p>Salud comercial y operativa del SaaS: organizaciones, MRR, soporte y uso de módulos.</p></div></div>
      <div className="stat-grid" style={{ marginBottom: 14 }}>
        <StatCard label="MRR" value={copShort(mrr)} icon={TrendingUp} tone="violet" foot={`${activas} organizaciones activas`} />
        <StatCard label="Copropiedades en la plataforma" value="23" icon={Building2} foot="8 ciudades · Colombia" />
        <StatCard label="Renovaciones próx. 60 días" value="3" icon={Repeat2} tone="amber" foot="SUB-202 vence 15-nov" />
        <StatCard label="Tickets abiertos" value={String(SOPORTE_TICKETS.filter(t => t.estado !== 'Cerrado').length)} icon={LifeBuoy} tone="red" foot="1 urgente · 1 de pago fallido" />
        <StatCard label="Uptime 90 días" value="99.97 %" icon={Server} tone="green" foot="SLA Empresarial 99.9 %" />
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2>Organizaciones con más copropiedades</h2><div className="panel-tools"><button className="btn btn-sm" onClick={() => navigate('/organizaciones-clientes')}>Ver todas <ArrowRight size={12} /></button></div></div>
          <div className="panel-body">
            {ORGANIZACIONES_SAAS.map(o => (
              <div className="list-row" key={o.id}><Building2 size={16} color="var(--violet)" /><div><b>{o.nombre}</b><div className="cell-sub">{o.copropiedades} copropiedades · plan {o.plan}</div></div><span className={`badge ${o.estado === 'Activa' ? 'badge-green' : 'badge-red'}`} style={{ marginLeft: 'auto' }}>{o.estado}</span></div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Soporte — prioridades</h2><div className="panel-tools"><button className="btn btn-sm" onClick={() => navigate('/solicitudes-de-soporte')}>Bandeja <ArrowRight size={12} /></button></div></div>
          <div className="panel-body">
            {SOPORTE_TICKETS.map(t => (
              <div className="list-row" key={t.id}><LifeBuoy size={16} color={t.prioridad === 'Urgente' ? 'var(--danger-red)' : 'var(--info)'} /><div><b style={{ fontSize: 11.5 }}>{t.asunto}</b><div className="cell-sub">{t.org} · {t.id}</div></div></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Resumen del proveedor ============ */
export function ProviderHome() {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-head"><div><h1>Órdenes asignadas — Ascensores OTIS Colombia</h1><p>Trabajos activos para Altos del Parque y otras copropiedades administradas por Urbania PH.</p></div></div>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Órdenes asignadas" value="2" icon={ClipboardList} tone="amber" foot="OT-2026-0142 · OT-2026-0145" />
        <StatCard label="Cumplimiento SLA (90d)" value="96 %" icon={Wrench} tone="green" />
        <StatCard label="Póliza de cumplimiento" value="Vigente" icon={ShieldCheck} foot="Vence 2027-03-01" />
      </div>
      <div className="panel"><div className="panel-head"><h2>Accesos</h2></div><div className="panel-body" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => navigate('/gestion-de-ordenes')}><ClipboardList size={15} /> Órdenes de trabajo</button>
        <button className="btn" onClick={() => navigate('/plan-de-mantenimiento')}><Wrench size={15} /> Plan de mantenimiento</button>
      </div></div>
    </>
  );
}
