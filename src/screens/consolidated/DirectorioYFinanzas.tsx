import {
  ContactRound, UserRound, ReceiptText, FileText, Wallet, ListFilter, Handshake, PiggyBank, Receipt, Landmark, CheckCircle2, Scale, CalendarRange, BookOpen, Percent,
} from 'lucide-react';
import { ConsolidatedScreen } from '../../components/ui/Consolidated';
import {
  DirectorioPropietarios, DirectorioResidentes,
} from '../admin/AdministracionA';
import { AntiguedadCartera } from '../admin/ReportesScreens';
import {
  GeneracionCuotas, EmisionCobros, EstadoCartera,
} from '../admin/FinanzasA';
import {
  GestionAcuerdos, GestionAnticipos,
} from '../admin/FinanzasB';
import {
  RegistroGastos, ObligacionesProveedores, ComprobantesAsientos, InformesContables,
} from '../admin/FinanzasC';
import { CatalogoConceptos } from '../admin/FinanzasA';
import { PeriodosFacturacion, DiariosContables, ImpuestosContables } from '../admin/FinanzasUrbania';

/* ============ Directorio de personas (filas 7+8) ============ */
export function DirectorioDePersonas() {
  return (
    <ConsolidatedScreen title="Directorio de personas" description="Propietarios titulares y residentes/ocupantes en una sola vista. Portería solo ve residentes."
      tabs={[
        { id: 'propietarios', label: 'Propietarios', icon: <UserRound size={13} />, roles: ['Administrador'] },
        { id: 'residentes', label: 'Residentes y ocupantes', icon: <ContactRound size={13} />, roles: ['Administrador', 'Portería'] },
      ]}>
      {active => active === 'propietarios' ? <DirectorioPropietarios /> : <DirectorioResidentes />}
    </ConsolidatedScreen>
  );
}

/* ============ Cuotas y cobros (filas 17+18 · + periodos Urbania) ============ */
export function CuotasYCobros() {
  return (
    <ConsolidatedScreen title="Cuotas y cobros" description="Flujo único del periodo: generar cuotas, previsualizar, emitir cuentas de cobro y controlar los periodos de facturación (abierto/cerrado)."
      tabs={[
        { id: 'generar', label: '1 · Generar cuotas', icon: <ReceiptText size={13} /> },
        { id: 'emitir', label: '2 · Emitir cobros', icon: <FileText size={13} /> },
        { id: 'periodos', label: '3 · Periodos de facturación', icon: <CalendarRange size={13} />, roles: ['Administrador', 'Contador'] },
      ]}
      fallback="generar">
      {active => active === 'generar' ? <GeneracionCuotas /> : active === 'emitir' ? <EmisionCobros /> : <PeriodosFacturacion />}
    </ConsolidatedScreen>
  );
}

/* ============ Cartera (filas 19+58+20+23) ============ */
export function CarteraConsolidada() {
  return (
    <ConsolidatedScreen title="Cartera" description="Saldos por unidad, antigüedad de mora, acuerdos de pago y saldos a favor — la deuda de la copropiedad en una sola vista."
      tabs={[
        { id: 'saldos', label: 'Saldos por unidad', icon: <Wallet size={13} /> },
        { id: 'antiguedad', label: 'Antigüedad', icon: <ListFilter size={13} /> },
        { id: 'acuerdos', label: 'Acuerdos de pago', icon: <Handshake size={13} />, roles: ['Administrador', 'Contador'] },
        { id: 'anticipos', label: 'Saldos a favor', icon: <PiggyBank size={13} />, roles: ['Administrador', 'Contador'] },
      ]}>
      {active => {
        switch (active) {
          case 'saldos': return <EstadoCartera />;
          case 'antiguedad': return <AntiguedadCartera />;
          case 'acuerdos': return <GestionAcuerdos />;
          default: return <GestionAnticipos />;
        }
      }}
    </ConsolidatedScreen>
  );
}
/* ============ Gastos y cuentas por pagar (filas 24+25) ============ */
export function GastosYCuentasPorPagar() {
  return (
    <ConsolidatedScreen title="Gastos y cuentas por pagar" description="Egresos de la copropiedad y facturas por aprobar o pagar a proveedores."
      tabs={[
        { id: 'egresos', label: 'Egresos', icon: <Receipt size={13} /> },
        { id: 'cxp', label: 'Cuentas por pagar', icon: <Landmark size={13} /> },
      ]}>
      {active => active === 'egresos' ? <RegistroGastos /> : <ObligacionesProveedores />}
    </ConsolidatedScreen>
  );
}

/* ============ Contabilidad e informes (filas 28+29+16 · + diarios/impuestos Urbania) ============ */
export function ContabilidadEInformes() {
  return (
    <ConsolidatedScreen title="Contabilidad e informes" description="Conceptos, diarios, asientos con partida doble, impuestos e informes contables. Consejo solo ve informes."
      tabs={[
        { id: 'comprobantes', label: 'Comprobantes', icon: <CheckCircle2 size={13} />, roles: ['Administrador', 'Contador'] },
        { id: 'diarios', label: 'Diarios', icon: <BookOpen size={13} />, roles: ['Administrador', 'Contador'] },
        { id: 'impuestos', label: 'Impuestos', icon: <Percent size={13} />, roles: ['Administrador', 'Contador'] },
        { id: 'informes', label: 'Informes contables', icon: <Scale size={13} /> },
        { id: 'conceptos', label: 'Conceptos de cobro', icon: <Receipt size={13} />, roles: ['Administrador', 'Contador'] },
      ]}>
      {active => {
        switch (active) {
          case 'comprobantes': return <ComprobantesAsientos />;
          case 'diarios': return <DiariosContables />;
          case 'impuestos': return <ImpuestosContables />;
          case 'informes': return <InformesContables />;
          default: return <CatalogoConceptos />;
        }
      }}
    </ConsolidatedScreen>
  );
}
