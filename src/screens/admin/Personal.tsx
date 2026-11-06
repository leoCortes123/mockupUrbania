import { useState } from 'react';
import {
  Plus, FileText, Download, Pencil, Banknote, Clock, Receipt, Plane,
  CheckCircle2, AlertTriangle, Info, ShieldCheck,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import { Tabs } from '../../components/ui/Tabs';
import { EditModal } from '../../components/ui/QuickModals';
import { Timeline, DocItem } from '../../components/ui/Misc';
import { useToast } from '../../components/ui/Toast';
import { PERSONAL } from '../../data/fixtures';
import { cop } from '../../lib/format';
import { AvatarName } from '../shared';

/* ==================================================================
 * PERSONAL — Expediente laboral 360° de cada empleado de la copropiedad.
 * Estructura basada en mockups/personal-expediente.html:
 * encabezado → KPIs → tabs (Detalle · Contrato y documentos · Ausencias ·
 * Dotación · Capacitaciones · Aportes · Historial) + directorio lateral.
 * ================================================================== */

interface Ausencia { tipo: string; sub?: string; periodo: string; dias: number; doc?: string; arl?: string; estado: string }
interface Dotacion { periodo: string; limite: string; entrega: string; elementos: string; valor: string; acta?: string; estado: string }
interface Capacitacion { nombre: string; tipo: string; entidad: string; fecha: string; horas: number; estado: string }
interface Aporte { periodo: string; salud: string; pension: string; arl: string; sena: string; icbf: string; estado: string }
interface ContratoHistorico { titulo: string; rango: string; detalle: string; actual?: boolean }
interface EmpleadoDetalle {
  codigo: string; documento: string; nacimiento: string; genero: string; telefono: string; correo: string; direccion: string; emergencia: string;
  area: string; contrato: string; ingreso: string; antiguedad: string; jornada: string;
  salario: number; neto: number; asistencia: number; asistenciaDelta: string; vacaciones: number; vacacionesMeta: string;
  eps: [string, string]; arl: [string, string]; arlAlerta: boolean; pension: [string, string]; caja: [string, string];
  alertas: { tono: 'warn' | 'red'; texto: string }[];
  contratos: ContratoHistorico[];
  ausencias: Ausencia[]; dotacion: Dotacion[]; capacitaciones: Capacitacion[]; aportes: Aporte[];
  historial: { time: string; actor?: string; text: string }[];
  docs: { name: string; meta: string }[];
}

const DETALLE: Record<number, EmpleadoDetalle> = {
  1: {
    codigo: 'EMP-0003', documento: 'CC 71.223.908', nacimiento: '12 de febrero de 1985 · 41 años', genero: 'Masculino',
    telefono: '601 745 0001', correo: 'porteria.a@altosdelparque.co', direccion: 'Calle 127 # 45-21, int. A, Medellín', emergencia: 'Elena Ríos (esposa) · 315 778 1123',
    area: 'Portería / vigilancia', contrato: 'Término fijo', ingreso: '1 de septiembre de 2022', antiguedad: '4 años y 2 meses', jornada: '42 h semanales · diurna',
    salario: 1_800_000, neto: 1_044_000, asistencia: 97.2, asistenciaDelta: '+1.8', vacaciones: 11, vacacionesMeta: 'De 30 · vence en abr 2027',
    eps: ['Sura', 'Afiliado desde sep 2022'], arl: ['Positiva', 'Clase V · riesgo máximo'], arlAlerta: false, pension: ['Colpensiones', 'Régimen prima media'], caja: ['Comfandi', 'N° 204 · desde sep 2022'],
    alertas: [],
    contratos: [
      { titulo: 'Contrato de trabajo a término fijo · Actual', rango: '1 sep 2026 → 31 ago 2027 · Salario $1.800.000 · Jornada 42 h', detalle: 'Renovación anual automática salvo preaviso de 30 días.', actual: true },
      { titulo: 'Contrato de trabajo a término fijo', rango: '1 sep 2022 → 31 ago 2026 · Salario $1.650.000', detalle: 'Cuatro renovaciones anuales previas.' },
    ],
    docs: [
      { name: 'Hoja de vida', meta: 'hoja_vida_porteria_a.pdf · 180 KB · 2022-08-25' },
      { name: 'Contrato firmado', meta: 'contrato_2026_porteria_a.pdf · 940 KB · 2026-09-01' },
      { name: 'Certificado laboral', meta: 'Sin archivo adjunto' },
    ],
    ausencias: [
      { tipo: 'Vacaciones', sub: 'Periodo 2025', periodo: '9 – 13 mar 2026', dias: 5, estado: 'Aprobada' },
      { tipo: 'Cita médica', periodo: '22 jul 2026', dias: 1, estado: 'Aprobada' },
    ],
    dotacion: [
      { periodo: 'Primer semestre', limite: '30 abr 2026', entrega: '28 abr 2026', elementos: 'Pantalón, camisa, zapato de seguridad', valor: '$172.000', acta: 'acta_dot_abr.pdf', estado: 'Entregada' },
      { periodo: 'Segundo semestre', limite: '31 ago 2026', entrega: '30 ago 2026', elementos: 'Pantalón, camisa, zapato de seguridad', valor: '$178.000', acta: 'acta_dot_ago.pdf', estado: 'Entregada' },
      { periodo: 'Tercer semestre', limite: '20 dic 2026', entrega: '—', elementos: 'Por definir', valor: '—', estado: 'Pendiente' },
    ],
    capacitaciones: [
      { nombre: 'Atención de incidentes y primeros auxilios', tipo: 'SG-SST', entidad: 'ARL Positiva', fecha: '10 mar 2026', horas: 8, estado: 'Asistió' },
      { nombre: 'Prevención de riesgos laborales', tipo: 'SG-SST', entidad: 'ARL Positiva', fecha: '15 ago 2026', horas: 4, estado: 'Asistió' },
    ],
    aportes: [
      { periodo: 'Oct 2026', salud: '$90.000', pension: '$72.000', arl: '$32.400', sena: '$36.000', icbf: '$30.000', estado: 'Pendiente' },
      { periodo: 'Sep 2026', salud: '$90.000', pension: '$72.000', arl: '$32.400', sena: '$36.000', icbf: '$30.000', estado: 'Pagado' },
      { periodo: 'Ago 2026', salud: '$90.000', pension: '$72.000', arl: '$32.400', sena: '$36.000', icbf: '$30.000', estado: 'Pagado' },
    ],
    historial: [
      { time: '2026-09-01 09:00', actor: 'Laura Gómez', text: 'Contrato renovado a término fijo hasta 31-ago-2027 (4.ª renovación).' },
      { time: '2026-08-30 10:15', actor: 'Rosa Estupiñán', text: 'Dotación segundo semestre entregada con acta firmada.' },
      { time: '2026-03-13 18:00', actor: 'Sistema', text: 'Vacaciones período 2025 aprobadas — 5 días (9–13 mar).' },
    ],
  },
  2: {
    codigo: 'EMP-0004', documento: 'CC 1.037.552.114', nacimiento: '3 de junio de 1991 · 35 años', genero: 'Masculino',
    telefono: '601 745 0002', correo: 'porteria.b@altosdelparque.co', direccion: 'Cra 45 # 120-30, int. B, Medellín', emergencia: 'Paola Duque (hermana) · 320 556 0091',
    area: 'Portería / vigilancia', contrato: 'Término fijo', ingreso: '15 de enero de 2023', antiguedad: '3 años y 9 meses', jornada: '42 h semanales · vespertina',
    salario: 1_800_000, neto: 1_044_000, asistencia: 95.8, asistenciaDelta: '+0.6', vacaciones: 9, vacacionesMeta: 'De 30 · vence en ene 2028',
    eps: ['Compensar', 'Afiliado desde ene 2023'], arl: ['Positiva', 'Clase V · riesgo máximo'], arlAlerta: false, pension: ['Protección', 'Régimen ahorro individual'], caja: ['Comfandi', 'N° 890 · desde ene 2023'],
    alertas: [],
    contratos: [
      { titulo: 'Contrato de trabajo a término fijo · Actual', rango: '15 ene 2026 → 14 ene 2027 · Salario $1.800.000 · Jornada 42 h', detalle: 'Renovación anual automática salvo preaviso de 30 días.', actual: true },
      { titulo: 'Contrato de trabajo a término fijo', rango: '15 ene 2023 → 14 ene 2026 · Salario $1.600.000', detalle: 'Tres renovaciones anuales previas.' },
    ],
    docs: [
      { name: 'Hoja de vida', meta: 'hoja_vida_porteria_b.pdf · 210 KB · 2023-01-10' },
      { name: 'Contrato firmado', meta: 'contrato_2026_porteria_b.pdf · 910 KB · 2026-01-15' },
      { name: 'Certificado laboral', meta: 'certificado_2026_porteria_b.pdf · 120 KB · 2026-06-30' },
    ],
    ausencias: [
      { tipo: 'Incapacidad laboral', sub: 'Lumbalgia', periodo: '11 – 13 may 2026', dias: 3, doc: 'inc_2026_051.pdf', arl: '13 may 2026 · al día', estado: 'Cerrada' },
      { tipo: 'Permiso de calamidad', sub: 'Familiar de primer grado', periodo: '2 – 3 jun 2026', dias: 2, doc: 'perm_calamidad.pdf', estado: 'Aprobada' },
    ],
    dotacion: [
      { periodo: 'Primer semestre', limite: '30 abr 2026', entrega: '29 abr 2026', elementos: 'Pantalón, camisa, zapato de seguridad', valor: '$172.000', acta: 'acta_dot_abr.pdf', estado: 'Entregada' },
      { periodo: 'Segundo semestre', limite: '31 ago 2026', entrega: '31 ago 2026', elementos: 'Pantalón, camisa, zapato de seguridad', valor: '$178.000', acta: 'acta_dot_ago.pdf', estado: 'Entregada' },
      { periodo: 'Tercer semestre', limite: '20 dic 2026', entrega: '—', elementos: 'Por definir', valor: '—', estado: 'Pendiente' },
    ],
    capacitaciones: [
      { nombre: 'Manejo y custodia de correspondencia', tipo: 'Operativa', entidad: 'Administración', fecha: '20 feb 2026', horas: 2, estado: 'Asistió' },
      { nombre: 'Prevención de riesgos laborales', tipo: 'SG-SST', entidad: 'ARL Positiva', fecha: '4 ago 2026', horas: 4, estado: 'Asistió' },
    ],
    aportes: [
      { periodo: 'Oct 2026', salud: '$90.000', pension: '$72.000', arl: '$32.400', sena: '$36.000', icbf: '$30.000', estado: 'Pendiente' },
      { periodo: 'Sep 2026', salud: '$90.000', pension: '$72.000', arl: '$32.400', sena: '$36.000', icbf: '$30.000', estado: 'Pagado' },
      { periodo: 'Ago 2026', salud: '$90.000', pension: '$72.000', arl: '$32.400', sena: '$36.000', icbf: '$30.000', estado: 'Pagado' },
    ],
    historial: [
      { time: '2026-06-13 08:00', actor: 'Sistema', text: 'Incapacidad lumbalgia registrada y reportada a la ARL (3 días).' },
      { time: '2026-01-15 09:00', actor: 'Laura Gómez', text: 'Contrato renovado a término fijo hasta 14-ene-2027.' },
      { time: '2025-12-20 10:00', actor: 'Portería', text: 'Relevo de turnos fin de año documentado en minuta digital.' },
    ],
  },
  3: {
    codigo: 'EMP-0005', documento: 'CC 79.884.120', nacimiento: '25 de octubre de 1978 · 48 años', genero: 'Masculino',
    telefono: '311 220 8899', correo: 'jaime.arias@altosdelparque.co', direccion: 'Calle 122 # 48-10, Medellín', emergencia: 'Carmenza Arias (esposa) · 300 112 8876',
    area: 'Mantenimiento', contrato: 'Indefinido', ingreso: '10 de marzo de 2019', antiguedad: '7 años y 8 meses', jornada: '42 h semanales · lunes a sábado',
    salario: 2_600_000, neto: 1_476_000, asistencia: 98.1, asistenciaDelta: '+0.4', vacaciones: 24, vacacionesMeta: 'De 30 · vence en dic 2027',
    eps: ['Nueva EPS', 'Afiliado desde mar 2019'], arl: ['Positiva', 'Clase III · riesgo medio'], arlAlerta: false, pension: ['Colpensiones', 'Régimen prima media'], caja: ['Comfama', 'N° 551 · desde mar 2019'],
    alertas: [],
    contratos: [
      { titulo: 'Contrato de trabajo indefinido · Actual', rango: '10 mar 2019 → vigente · Salario $2.600.000 · Jornada 42 h', detalle: 'Incremento salarial 2026-09-14: $2.350.000 → $2.600.000.', actual: true },
    ],
    docs: [
      { name: 'Hoja de vida', meta: 'hoja_vida_jarias.pdf · 320 KB · 2019-03-02' },
      { name: 'Contrato firmado', meta: 'contrato_2019_indefinido_jarias.pdf · 1,3 MB · 2019-03-10' },
      { name: 'Certificado laboral', meta: 'certificado_2026_jarias.pdf · 130 KB · 2026-09-30' },
    ],
    ausencias: [
      { tipo: 'Vacaciones', sub: 'Periodo 2025', periodo: '20 – 31 ene 2026', dias: 10, estado: 'Aprobada' },
      { tipo: 'Cita médica', periodo: '18 ago 2026', dias: 1, estado: 'Pendiente registro' },
    ],
    dotacion: [
      { periodo: 'Primer semestre', limite: '30 abr 2026', entrega: '27 abr 2026', elementos: 'Jean, camiseta, botas de seguridad', valor: '$195.000', acta: 'acta_dot_abr.pdf', estado: 'Entregada' },
      { periodo: 'Segundo semestre', limite: '31 ago 2026', entrega: '31 ago 2026', elementos: 'Jean, camiseta, botas de seguridad', valor: '$202.000', acta: 'acta_dot_ago.pdf', estado: 'Entregada' },
      { periodo: 'Tercer semestre', limite: '20 dic 2026', entrega: '—', elementos: 'Por definir', valor: '—', estado: 'Pendiente' },
    ],
    capacitaciones: [
      { nombre: 'Trabajo en alturas — recertificación', tipo: 'SG-SST', entidad: 'CRUDATOMED', fecha: '12 feb 2026', horas: 12, estado: 'Asistió' },
      { nombre: 'Manejo integral del SG-SST', tipo: 'SG-SST', entidad: '—', fecha: '—', horas: 2, estado: 'Vencida' },
    ],
    aportes: [
      { periodo: 'Oct 2026', salud: '$130.000', pension: '$104.000', arl: '$21.500', sena: '$52.000', icbf: '$44.200', estado: 'Pendiente' },
      { periodo: 'Sep 2026', salud: '$130.000', pension: '$104.000', arl: '$21.500', sena: '$52.000', icbf: '$44.200', estado: 'Pagado' },
    ],
    historial: [
      { time: '2026-09-14 11:00', actor: 'Laura Gómez', text: 'Incremento salarial: $2.350.000 → $2.600.000 (acta de comité 2026-04).' },
      { time: '2026-08-31 09:30', actor: 'Néstor Beltrán', text: 'Capacitación "Prevención de riesgos laborales" certificada.' },
      { time: '2026-02-12 15:00', actor: 'Sistema', text: 'Recertificación trabajo en alturas aprobada (12 h).' },
    ],
  },
  4: {
    codigo: 'EMP-0006', documento: 'CC 43.118.902', nacimiento: '8 de julio de 1989 · 37 años', genero: 'Femenino',
    telefono: '312 445 9012', correo: 'r.estupinan@correo.com', direccion: 'Calle 48 # 33-21, Medellín', emergencia: 'Andrés Estupiñán · 311 220 8845',
    area: 'Aseo y servicios generales', contrato: 'Término fijo', ingreso: '14 de marzo de 2021', antiguedad: '5 años y 8 meses', jornada: '42 h semanales · rotativo 12 h',
    salario: 1_600_000, neto: 931_000, asistencia: 96.4, asistenciaDelta: '+2.1', vacaciones: 18, vacacionesMeta: 'De 30 · vence en dic 2027',
    eps: ['Sura', 'Afiliado desde mar 2021'], arl: ['Positiva', 'Clase IV · riesgo alto'], arlAlerta: true, pension: ['Colpensiones', 'Régimen prima media'], caja: ['Comfenalco', 'N° 112 · desde mar 2021'],
    alertas: [
      { tono: 'warn', texto: 'ARL vence en 12 días y el contrato a término fijo vence en 21 días. El sistema no genera alarmas hoy: solo vigila tbl_polizas, no los datos de empleados.' },
      { tono: 'red', texto: 'Dotación de tercer semestre (20 dic 2026) aún no programada. Art. 230 CST: calzado y vestido de labor, tres veces al año.' },
    ],
    contratos: [
      { titulo: 'Contrato de trabajo a término fijo · Actual', rango: '14 mar 2026 → 13 mar 2027 · Salario $1.600.000 · Jornada 42 h', detalle: 'Salario mínimo legal vigente + subsidio de transporte.', actual: true },
      { titulo: 'Contrato de trabajo a término fijo', rango: '14 mar 2021 → 13 mar 2026 · Salario $1.450.000', detalle: 'Cinco renovaciones anuales previas.' },
    ],
    docs: [
      { name: 'Hoja de vida', meta: 'hoja_vida_restupinan.pdf · 240 KB · 2021-03-02' },
      { name: 'Contrato firmado', meta: 'contrato_2026_restupinan.pdf · 1,1 MB · 2026-03-14' },
      { name: 'Certificado laboral', meta: 'Sin archivo adjunto' },
    ],
    ausencias: [
      { tipo: 'Incapacidad laboral', sub: 'Codo derecho', periodo: '2 – 6 jun 2026', dias: 5, doc: 'inc_2026_062.pdf', arl: '3 jun 2026 · al día', estado: 'Cerrada' },
      { tipo: 'Vacaciones', sub: 'Periodo 2025', periodo: '20 – 25 ene 2026', dias: 6, estado: 'Aprobada' },
      { tipo: 'Permiso de calamidad', sub: 'Familiar de primer grado', periodo: '4 – 5 feb 2026', dias: 2, doc: 'perm_calamidad.pdf', estado: 'Aprobada' },
      { tipo: 'Cita médica', periodo: '18 ago 2026', dias: 1, estado: 'Pendiente registro' },
    ],
    dotacion: [
      { periodo: 'Primer semestre', limite: '30 abr 2026', entrega: '28 abr 2026', elementos: 'Pantaleta, camiseta, zapato', valor: '$186.000', acta: 'acta_dot_abr.pdf', estado: 'Entregada' },
      { periodo: 'Segundo semestre', limite: '31 ago 2026', entrega: '31 ago 2026', elementos: 'Pantaleta, camiseta, zapato', valor: '$192.000', acta: 'acta_dot_ago.pdf', estado: 'Entregada' },
      { periodo: 'Tercer semestre', limite: '20 dic 2026', entrega: '—', elementos: 'Por definir', valor: '—', estado: 'Pendiente' },
    ],
    capacitaciones: [
      { nombre: 'Atención de incidentes y primeros auxilios', tipo: 'SG-SST', entidad: 'CRUDATOMED', fecha: '12 feb 2026', horas: 8, estado: 'Asistió' },
      { nombre: 'Prevención de riesgos laborales', tipo: 'SG-SST', entidad: 'ARL Positiva', fecha: '4 ago 2026', horas: 4, estado: 'Asistió' },
      { nombre: 'Manejo integral del SG-SST', tipo: 'SG-SST', entidad: '—', fecha: '—', horas: 2, estado: 'Vencida' },
    ],
    aportes: [
      { periodo: 'Oct 2026', salud: '$80.000', pension: '$64.000', arl: '$22.400', sena: '$32.000', icbf: '$27.400', estado: 'Pendiente' },
      { periodo: 'Sep 2026', salud: '$80.000', pension: '$64.000', arl: '$22.400', sena: '$32.000', icbf: '$27.400', estado: 'Pagado' },
      { periodo: 'Ago 2026', salud: '$80.000', pension: '$64.000', arl: '$22.400', sena: '$32.000', icbf: '$27.400', estado: 'Pagado' },
    ],
    historial: [
      { time: '2026-09-14 09:00', actor: 'Laura Gómez', text: 'Salario actualizado: $1.490.000 → $1.600.000 (acuerdo comité 2026-04).' },
      { time: '2026-06-06 08:00', actor: 'Sistema', text: 'Incapacidad codo derecho registrada y reportada a la ARL el 3 jun (5 días).' },
      { time: '2026-01-25 18:00', actor: 'Laura Gómez', text: 'Vacaciones periodo 2025 aprobadas — 6 días (20–25 ene).' },
      { time: '2026-04-28 10:30', actor: 'Rosa Estupiñán', text: 'Dotación primer semestre entregada con acta firmada.' },
    ],
  },
  5: {
    codigo: 'EMP-0007', documento: 'CC 70.556.231', nacimiento: '18 de abril de 1983 · 43 años', genero: 'Masculino',
    telefono: '313 778 1234', correo: 'n.beltran@altosdelparque.co', direccion: 'Cra 44 # 118-52, Medellín', emergencia: 'Luz Beltrán (esposa) · 301 445 0928',
    area: 'Zonas verdes y oficios varios', contrato: 'Indefinido', ingreso: '5 de junio de 2017', antiguedad: '9 años y 5 meses', jornada: '42 h semanales · lunes a sábado',
    salario: 1_750_000, neto: 1_015_000, asistencia: 98.9, asistenciaDelta: '+0.2', vacaciones: 26, vacacionesMeta: 'De 30 · vence en jun 2027',
    eps: ['Compensar', 'Afiliado desde jun 2017'], arl: ['Sura', 'Clase III · riesgo medio'], arlAlerta: false, pension: ['Protección', 'Régimen ahorro individual'], caja: ['Comfama', 'N° 402 · desde jun 2017'],
    alertas: [],
    contratos: [
      { titulo: 'Contrato de trabajo indefinido · Actual', rango: '5 jun 2017 → vigente · Salario $1.750.000 · Jornada 42 h', detalle: 'Contrato original indefinido desde el ingreso.', actual: true },
    ],
    docs: [
      { name: 'Hoja de vida', meta: 'hoja_vida_neltran.pdf · 260 KB · 2017-05-28' },
      { name: 'Contrato firmado', meta: 'contrato_2017_indefinido_neltran.pdf · 1,0 MB · 2017-06-05' },
      { name: 'Certificado laboral', meta: 'certificado_2026_neltran.pdf · 115 KB · 2026-10-02' },
    ],
    ausencias: [
      { tipo: 'Vacaciones', sub: 'Periodo 2025', periodo: '13 – 24 abr 2026', dias: 10, estado: 'Aprobada' },
    ],
    dotacion: [
      { periodo: 'Primer semestre', limite: '30 abr 2026', entrega: '29 abr 2026', elementos: 'Jean, camiseta, botas pantaneras', valor: '$188.000', acta: 'acta_dot_abr.pdf', estado: 'Entregada' },
      { periodo: 'Segundo semestre', limite: '31 ago 2026', entrega: '31 ago 2026', elementos: 'Jean, camiseta, botas pantaneras', valor: '$194.000', acta: 'acta_dot_ago.pdf', estado: 'Entregada' },
      { periodo: 'Tercer semestre', limite: '20 dic 2026', entrega: '—', elementos: 'Por definir', valor: '—', estado: 'Pendiente' },
    ],
    capacitaciones: [
      { nombre: 'Manejo seguro de plaguicidas', tipo: 'SG-SST', entidad: 'ARL Sura', fecha: '22 may 2026', horas: 6, estado: 'Asistió' },
    ],
    aportes: [
      { periodo: 'Oct 2026', salud: '$87.500', pension: '$70.000', arl: '$14.500', sena: '$35.000', icbf: '$29.750', estado: 'Pendiente' },
      { periodo: 'Sep 2026', salud: '$87.500', pension: '$70.000', arl: '$14.500', sena: '$35.000', icbf: '$29.750', estado: 'Pagado' },
    ],
    historial: [
      { time: '2026-10-02 09:00', actor: 'Laura Gómez', text: 'Certificado laboral emitido a solicitud del empleado.' },
      { time: '2026-05-22 14:00', actor: 'Sistema', text: 'Capacitación plaguicidas certificada (6 h).' },
      { time: '2026-04-24 18:00', actor: 'Laura Gómez', text: 'Vacaciones periodo 2025 aprobadas — 10 días (13–24 abr).' },
    ],
  },
};

const SECCIONES_SOCIALES = [
  { key: 'eps' as const, label: 'EPS' },
  { key: 'arl' as const, label: 'ARL' },
  { key: 'pension' as const, label: 'Fondo de pensión' },
  { key: 'caja' as const, label: 'Caja de compensación' },
];

export function DirectorioPersonal() {
  const { toast } = useToast();
  const [selId, setSelId] = useState(4); // Rosa Estupiñán — ficha con alertas visibles
  const [tab, setTab] = useState('detalle');
  const [edit, setEdit] = useState(false);
  const emp = PERSONAL.find(p => p.id === selId)!;
  const d = DETALLE[emp.id];
  const abiertas = d.ausencias.filter(a => a.estado === 'Pendiente registro').length;
  const capsVencidas = d.capacitaciones.filter(c => c.estado === 'Vencida').length;

  return (
    <>
      <PageHead title="Personal" description="Expediente laboral 360° de los empleados y personal operativo: contrato, salario, seguridad social, ausencias, dotación, capacitaciones, aportes e historial.">
        <button className="btn" onClick={() => toast('ok', 'Certificado laboral', `Generando certificado laboral de ${emp.nombre}… (simulado)`)}><FileText size={14} /> Certificado laboral</button>
        <button className="btn" onClick={() => toast('ok', 'Desprendible', 'Descargando último desprendible de nómina… (simulado)')}><Download size={14} /> Desprendible</button>
        <button className="btn btn-primary" onClick={() => setEdit(true)}><Pencil size={14} /> Editar expediente</button>
      </PageHead>

      {/* ===== Ficha 360 del empleado ===== */}
      <div>
          {/* Encabezado */}
          <div className="panel" style={{ marginBottom: 12 }}>
            <div className="panel-body" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
              <AvatarName name={emp.nombre} size={64} />
              <div style={{ minWidth: 240, flex: 1 }}>
                <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .8 }}>Expediente laboral · {d.codigo}</div>
                <b style={{ fontSize: 18, letterSpacing: -.3 }}>{emp.nombre}</b>
                <div className="muted" style={{ fontSize: 12 }}>{emp.cargo} · {d.area} · Ingresó el {d.ingreso} · {d.jornada}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-green badge-dot">Activo</span>
                  {d.arlAlerta && <span className="badge badge-amber">Contrato vence en 21 días</span>}
                  {d.arlAlerta && <span className="badge badge-red">ARL por vencer</span>}
                  {emp.documentos !== 'Al día' && !d.arlAlerta && <span className="badge badge-amber">{emp.documentos}</span>}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
                <span className="muted" style={{ fontSize: 11, fontWeight: 600 }}>Expediente de</span>
                <select className="input" style={{ width: 'auto' }} value={selId} onChange={e => setSelId(Number(e.target.value))} aria-label="Seleccionar empleado">
                  {PERSONAL.map(p => <option key={p.id} value={p.id}>{p.nombre} — {p.cargo}</option>)}
                </select>
                <button className="btn btn-sm" onClick={() => toast('info', 'Nueva ficha', 'Alta de empleado con contrato y documentos (simulado).')}><Plus size={13} /> Nueva ficha</button>
              </label>
            </div>
          </div>

          {/* KPIs */}
          <div className="stat-grid" style={{ marginBottom: 12 }}>
            <StatCard label="Salario base" value={cop(d.salario)} foot={`Mensual · quincenal ${cop(Math.round(d.salario / 2))}`} icon={Banknote} />
            <StatCard label="Asistencia mes" value={`${d.asistencia} %`} foot={<><b style={{ color: 'var(--ok)' }}>{d.asistenciaDelta}</b> vs. mes anterior</>} icon={Clock} tone="green" />
            <StatCard label="Neto quincenal" value={cop(d.neto)} foot="Última liquidación: oct 2026" icon={Receipt} tone="blue" />
            <StatCard label="Vacaciones" value={`${d.vacaciones} días`} foot={d.vacacionesMeta} icon={Plane} tone="amber" />
          </div>

          {/* Tabs del expediente */}
          <Tabs active={tab} onChange={setTab} tabs={[
            { id: 'detalle', label: 'Detalle' },
            { id: 'contrato', label: 'Contrato y documentos' },
            { id: 'ausencias', label: `Ausencias (${d.ausencias.length})` },
            { id: 'dotacion', label: 'Dotación' },
            { id: 'capacitaciones', label: `Capacitaciones (${d.capacitaciones.length})` },
            { id: 'aportes', label: 'Aportes' },
            { id: 'historial', label: 'Historial' },
          ]} />

          {tab === 'detalle' && (
            <>
              <div className="grid-2-even" style={{ marginBottom: 12 }}>
                <div className="panel">
                  <div className="panel-head"><h2>Datos personales</h2></div>
                  <div className="panel-body">
                    <dl className="kv">
                      {[['Tipo y número de documento', d.documento], ['Fecha de nacimiento', d.nacimiento], ['Género', d.genero], ['Teléfono', d.telefono], ['Correo', d.correo], ['Dirección', d.direccion], ['Contacto de emergencia', d.emergencia]].map(([k, v]) => (
                        <div style={{ display: 'contents' }} key={k}><dt>{k}</dt><dd>{v}</dd></div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-head"><h2>Datos laborales</h2></div>
                  <div className="panel-body">
                    <dl className="kv">
                      {[['Cargo', emp.cargo], ['Área', d.area], ['Tipo de contrato', d.contrato], ['Fecha de ingreso', d.ingreso], ['Antigüedad', d.antiguedad], ['Jornada', d.jornada], ['Salario', `${cop(d.salario)} / mes`], ['Usuario en el portal', 'Vinculado · rol Trabajador']].map(([k, v]) => (
                        <div style={{ display: 'contents' }} key={k}><dt>{k}</dt><dd>{v}</dd></div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>

              <div className="panel-head" style={{ padding: '2px 4px 6px' }}><h2 style={{ fontSize: 13 }}>Seguridad social y parafiscales</h2></div>
              <div className="grid-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 12 }}>
                {SECCIONES_SOCIALES.map(({ key, label }) => (
                  <div className="panel" key={key}><div className="panel-body" style={{ padding: 12 }}>
                    <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6 }}>{label}{key === 'arl' && d.arlAlerta && <span style={{ color: 'var(--danger-red)' }}> · por vencer</span>}</div>
                    <div style={{ fontWeight: 800, marginTop: 4 }}>{d[key][0]}</div>
                    <div className="cell-sub">{d[key][1]}</div>
                  </div></div>
                ))}
              </div>

              {d.alertas.map((a, i) => (
                <div key={i} className={a.tono === 'red' ? 'warn-box' : 'warn-box'} style={{ marginBottom: 8, ...(a.tono === 'red' ? { background: 'var(--danger-soft)', borderColor: '#f3c1c1', color: '#7f1d1d' } : {}) }}>
                  <AlertTriangle size={17} /><span>{a.texto}</span>
                </div>
              ))}
              {d.alertas.length === 0 && (
                <div className="success-box"><CheckCircle2 size={17} /><span>Expediente al día: contrato vigente, ARL al corriente y documentos sin vencer. Próxima revisión automática: 1 dic 2026.</span></div>
              )}
            </>
          )}

          {tab === 'contrato' && (
            <div className="grid-2-even">
              <div className="panel">
                <div className="panel-head"><h2>Historial de contratos</h2><div className="panel-tools"><button className="btn btn-sm" onClick={() => toast('info', 'Nuevo contrato', 'Alta de contrato con vigencias y salario (simulado).')}><Plus size={13} /> Nuevo contrato</button></div></div>
                <div className="panel-body">
                  <div className="timeline" style={{ paddingLeft: 18 }}>
                    {d.contratos.map((c, i) => (
                      <div className="timeline-item" key={i}>
                        <time>{c.actual ? 'Actual' : 'Histórico'}</time>
                        <p><b>{c.titulo}</b></p>
                        <p className="muted">{c.rango}</p>
                        <p className="muted">{c.detalle}</p>
                        {c.actual && (
                          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                            <button className="btn btn-sm" onClick={() => toast('info', 'Contrato', 'Abriendo contrato_signed.pdf (simulado).')}>Ver contrato</button>
                            <button className="btn btn-sm" onClick={() => toast('info', 'Certificado laboral', 'Generando certificado laboral… (simulado).')}>Certificado laboral</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-head"><h2>Documentos del expediente</h2></div>
                <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {d.docs.map(doc => (
                    <DocItem key={doc.name} name={doc.name} meta={doc.meta} onDownload={() => toast('ok', doc.meta.includes('Sin archivo') ? 'Adjuntar' : 'Descarga simulada', doc.meta.includes('Sin archivo') ? `Seleccionar archivo para "${doc.name}" (simulado).` : doc.name)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'ausencias' && (
            <div className="panel">
              <div className="panel-body">
                <div className="stat-grid" style={{ marginBottom: 12 }}>
                  <StatCard label="Saldo de vacaciones" value={`${d.vacaciones} días`} foot="Días disponibles" icon={Plane} />
                  <StatCard label="Tomadas (2026)" value={d.ausencias.filter(a => a.tipo === 'Vacaciones').reduce((a, x) => a + x.dias, 0)} foot="Días consumidos" icon={Clock} tone="blue" />
                  <StatCard label="Incapacidades (2026)" value={d.ausencias.filter(a => a.tipo === 'Incapacidad laboral').reduce((a, x) => a + x.dias, 0)} foot="Días · reportados a ARL" icon={AlertTriangle} tone="red" />
                  <StatCard label="Permisos" value={d.ausencias.filter(a => a.tipo.startsWith('Permiso')).reduce((a, x) => a + x.dias, 0)} foot="Días en el año" icon={FileText} tone="violet" />
                </div>
                <div className="table-wrap">
                  <table className="data">
                    <thead><tr><th>Tipo</th><th>Periodo</th><th>Días</th><th>Documento</th><th>Reportado a ARL</th><th>Estado</th></tr></thead>
                    <tbody>
                      {d.ausencias.map((a, i) => (
                        <tr key={i}>
                          <td><div className="cell-main">{a.tipo}</div>{a.sub && <div className="cell-sub">{a.sub}</div>}</td>
                          <td>{a.periodo}</td>
                          <td className="mono">{a.dias}</td>
                          <td className="cell-sub">{a.doc ?? '—'}</td>
                          <td className="cell-sub">{a.arl ?? '—'}</td>
                          <td><span className={`badge badge-${a.estado === 'Cerrada' || a.estado === 'Aprobada' ? 'green' : 'amber'}`}>{a.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn" style={{ marginTop: 10 }} onClick={() => toast('info', 'Registrar ausencia', 'Formulario de ausencia con soporte adjunto (simulado).')}><Plus size={14} /> Registrar ausencia</button>
                {abiertas > 0 && <span className="cell-sub" style={{ marginLeft: 10 }}>{abiertas} ausencia(s) pendiente(s) de registro</span>}
              </div>
            </div>
          )}

          {tab === 'dotacion' && (
            <div className="panel">
              <div className="panel-body">
                <div className="info-box" style={{ marginBottom: 10 }}><Info size={17} /><span>El art. 230 del CST obliga a entregar calzado y vestido de labor <b>tres veces al año</b> a quienes devengan hasta dos salarios mínimos: <b>30 de abril, 31 de agosto y 20 de diciembre</b>.</span></div>
                <div className="table-wrap">
                  <table className="data">
                    <thead><tr><th>Periodo</th><th>Fecha límite</th><th>Fecha entrega</th><th>Elementos</th><th>Valor</th><th>Acta</th><th>Estado</th></tr></thead>
                    <tbody>
                      {d.dotacion.map((x, i) => (
                        <tr key={i}>
                          <td className="cell-main">{x.periodo}</td><td>{x.limite}</td><td>{x.entrega}</td>
                          <td className="cell-sub">{x.elementos}</td><td className="mono">{x.valor}</td><td className="cell-sub">{x.acta ?? '—'}</td>
                          <td><span className={`badge badge-${x.estado === 'Entregada' ? 'green' : 'amber'}`}>{x.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn" style={{ marginTop: 10 }} onClick={() => toast('info', 'Programar entrega', 'Entrega de dotación con acta de recibido (simulado).')}><Plus size={14} /> Registrar entrega</button>
              </div>
            </div>
          )}

          {tab === 'capacitaciones' && (
            <div className="panel">
              <div className="panel-body">
                <div className="warn-box" style={{ marginBottom: 10 }}><AlertTriangle size={17} /><span><b>Matriz legal de capacitación.</b> El Decreto 1072 de 2015 y la Resolución 0312 de 2019 exigen capacitaciones periódicas según el riesgo. {capsVencidas > 0 ? `${capsVencidas} capacitación(es) vencida(s) o pendiente(s).` : 'Al día.'}</span></div>
                <div className="table-wrap">
                  <table className="data">
                    <thead><tr><th>Capacitación</th><th>Tipo</th><th>Entidad</th><th>Fecha</th><th>Horas</th><th>Estado</th></tr></thead>
                    <tbody>
                      {d.capacitaciones.map((c, i) => (
                        <tr key={i}>
                          <td className="cell-main">{c.nombre}</td><td><span className="badge badge-blue">{c.tipo}</span></td>
                          <td className="cell-sub">{c.entidad}</td><td>{c.fecha}</td><td className="mono">{c.horas}</td>
                          <td><span className={`badge badge-${c.estado === 'Asistió' ? 'green' : 'red'}`}>{c.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn" style={{ marginTop: 10 }} onClick={() => toast('info', 'Nueva capacitación', 'Programar capacitación con entidad y horas (simulado).')}><Plus size={14} /> Programar capacitación</button>
              </div>
            </div>
          )}

          {tab === 'aportes' && (
            <div className="panel">
              <div className="panel-body">
                <div className="info-box" style={{ marginBottom: 10 }}><Info size={17} /><span>Salud, pensión, ARL y caja se pagan con la <b>planilla PILA</b> dentro de los primeros 10 días del mes siguiente. Las copropiedades residenciales <b>no están exoneradas</b> de parafiscales (art. 114-1 ET) por no ser contribuyentes del impuesto de renta.</span></div>
                <div className="table-wrap">
                  <table className="data">
                    <thead><tr><th>Periodo</th><th>Salud</th><th>Pensión</th><th>ARL</th><th>SENA</th><th>ICBF</th><th>Estado</th></tr></thead>
                    <tbody>
                      {d.aportes.map((a, i) => (
                        <tr key={i}>
                          <td className="cell-main">{a.periodo}</td><td className="mono">{a.salud}</td><td className="mono">{a.pension}</td>
                          <td className="mono">{a.arl}</td><td className="mono">{a.sena}</td><td className="mono">{a.icbf}</td>
                          <td><span className={`badge badge-${a.estado === 'Pagado' ? 'green' : 'amber'}`}>{a.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="warn-box" style={{ marginTop: 10 }}><ShieldCheck size={17} /><span>La exoneración del art. 114-1 del ET <b>no cubre la caja de compensación</b> y, según el Consejo de Estado (2019), <b>no aplica a copropiedades residenciales</b>. Liquidación PILA: dentro de los primeros 10 días del mes.</span></div>
              </div>
            </div>
          )}

          {tab === 'historial' && (
            <div className="panel">
              <div className="panel-body">
                <div className="info-box" style={{ marginBottom: 10 }}><Info size={17} /><span>El historial se alimenta del registro de auditoría de operaciones. Sin <code>AuditLogger</code> activo, los cambios de salario y afiliaciones no quedan trazados.</span></div>
                <Timeline items={d.historial} />
              </div>
            </div>
          )}
      </div>

      {edit && (
        <EditModal title={`Editar expediente — ${emp.nombre}`} onClose={() => setEdit(false)}
          initial={{ cargo: emp.cargo, contrato: d.contrato, ingreso: d.ingreso, jornada: d.jornada, salario: String(d.salario), eps: d.eps[0], arl: d.arl[0], emergencia: d.emergencia }}
          fields={[
            { name: 'cargo', label: 'Cargo', required: true },
            { name: 'contrato', label: 'Tipo de contrato', type: 'select', options: ['Indefinido', 'Término fijo', 'Obra o labor', 'Prestación de servicios'], half: true },
            { name: 'ingreso', label: 'Fecha de ingreso', half: true },
            { name: 'jornada', label: 'Jornada', half: true },
            { name: 'salario', label: 'Salario mensual', type: 'number', half: true },
            { name: 'eps', label: 'EPS', half: true },
            { name: 'arl', label: 'ARL', half: true },
            { name: 'emergencia', label: 'Contacto de emergencia', half: false },
          ]} />
      )}
    </>
  );
}
