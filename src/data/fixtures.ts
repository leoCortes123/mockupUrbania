/* ============================================================
   DATOS FICTICIOS — Conjunto Residencial Altos del Parque
   Copropiedad colombiana (Bogotá). Todos los datos son falsos.
   ============================================================ */

export const COPROPIEDADES = [
  { id: 'c1', nombre: 'Altos del Parque', nit: '901.245.678-3', ciudad: 'Bogotá D.C.', unidades: 240, plan: 'Profesional' },
  { id: 'c2', nombre: 'Reserva de Los Rosales', nit: '860.112.345-9', ciudad: 'Chía, Cundinamarca', unidades: 128, plan: 'Esencial' },
  { id: 'c3', nombre: 'Torres del Bosque', nit: '830.554.221-1', ciudad: 'Medellín, Antioquia', unidades: 312, plan: 'Empresarial' },
];

export const COPROPIEDAD_ACTUAL = COPROPIEDADES[0];

export const KPIS = {
  unidades: 240,
  residentes: 612,
  carteraPendiente: 48_750_000,
  recaudoPeriodo: 182_400_000,
  gastosPeriodo: 121_350_000,
  pqrsPendientes: 17,
  ordenesAbiertas: 9,
  recaudoMeta: 215_000_000,
};

export const INGRESOS_EGRESOS = [
  { mes: 'May', ingresos: 168.5, egresos: 112.2 },
  { mes: 'Jun', ingresos: 174.2, egresos: 118.9 },
  { mes: 'Jul', ingresos: 171.8, egresos: 105.4 },
  { mes: 'Ago', ingresos: 189.3, egresos: 126.7 },
  { mes: 'Sep', ingresos: 195.6, egresos: 131.2 },
  { mes: 'Oct', ingresos: 182.4, egresos: 121.35 },
]; // millones de COP

export const CARTERA_AGING = [
  { rango: 'No vencida', valor: 12_400_000, unidades: 58, color: '#15803d' },
  { rango: '1 – 30 días', valor: 9_800_000, unidades: 24, color: '#d97706' },
  { rango: '31 – 60 días', valor: 8_150_000, unidades: 15, color: '#ea580c' },
  { rango: '61 – 90 días', valor: 7_600_000, unidades: 11, color: '#c2410c' },
  { rango: 'Más de 90 días', valor: 10_800_000, unidades: 13, color: '#b91c1c' },
];

export const VENCIMIENTOS = [
  { fecha: '2026-11-05', titulo: 'Pago póliza administración', monto: 4_800_000, tipo: 'Seguro' },
  { fecha: '2026-11-08', titulo: 'Cuota extraordinario impermeabilización', monto: 28_600_000, tipo: 'Cuota' },
  { fecha: '2026-11-12', titulo: 'Factura aseo — ServiClean S.A.S', monto: 6_300_000, tipo: 'Proveedor' },
  { fecha: '2026-11-15', titulo: 'Intereses mora — liquidación Nov', monto: 1_250_000, tipo: 'Financiero' },
  { fecha: '2026-11-20', titulo: 'Renovación certificado RETI', monto: 950_000, tipo: 'Trámite' },
];

export const ACTIVIDAD_RECIENTE = [
  { fecha: '2026-11-03 08:12', usuario: 'Laura Gómez', modulo: 'Finanzas', evento: 'Registro de pago $ 1.450.000 — Apto 502, Torre B' },
  { fecha: '2026-11-03 07:45', usuario: 'Portería Turno A', modulo: 'Seguridad', evento: 'Ingreso visitante autorizado — Apto 1103, Torre A (código 88412)' },
  { fecha: '2026-11-02 18:30', usuario: 'Andrés Ruiz', modulo: 'Operaciones', evento: 'OT-2026-0141 cerrada: reparación de ascensor Torre C' },
  { fecha: '2026-11-02 16:05', usuario: 'Marcela Torres', modulo: 'Comunidad', evento: 'Comunicado "Corte de agua programado" publicado para 240 unidades' },
  { fecha: '2026-11-02 11:20', usuario: 'Laura Gómez', modulo: 'Finanzas', evento: 'Conciliación bancaria octubre: 312 movimientos, 4 diferencias' },
  { fecha: '2026-11-01 09:00', usuario: 'Sistema', modulo: 'Finanzas', evento: 'Generación automática de cuotas ordinarias Nov-2026 (240 unidades)' },
  { fecha: '2026-11-01 08:15', usuario: 'Felipe Osorio', modulo: 'Administración', evento: 'Actualización coeficiente — Apto 804 Torre A (1.0421 → 1.0455)' },
];

export const UNIDADES = [
  { id: 'U-501', unidad: '501', torre: 'A', tipo: 'Apartamento', coef: 1.0212, area: 68, propietario: 'Carlos Arturo Ramírez', estado: 'Ocupada', cartera: 0 },
  { id: 'U-502', unidad: '502', torre: 'B', tipo: 'Apartamento', coef: 1.0212, area: 68, propietario: 'Diana Marcela Peña', estado: 'Ocupada', cartera: 0 },
  { id: 'U-1103', unidad: '1103', torre: 'A', tipo: 'Apartamento', coef: 1.4587, area: 92, propietario: 'Jorge Enrique Salazar', estado: 'Ocupada', cartera: 2_850_000 },
  { id: 'U-804', unidad: '804', torre: 'A', tipo: 'Apartamento', coef: 1.0455, area: 71, propietario: 'Sandra Lucía Contreras', estado: 'Ocupada', cartera: 950_000 },
  { id: 'U-1201', unidad: '1201', torre: 'C', tipo: 'Apartamento', coef: 1.3890, area: 88, propietario: 'Ricardo Antonio Nieto', estado: 'Desocupada', cartera: 5_700_000 },
  { id: 'U-LC-03', unidad: 'LC-03', torre: '—', tipo: 'Local', coef: 0.9876, area: 120, propietario: 'Panadería La Espiga S.A.S', estado: 'Ocupada', cartera: 1_450_000 },
  { id: 'U-P-118', unidad: 'P-118', torre: '—', tipo: 'Parqueadero', coef: 0.2104, area: 12, propietario: 'Carlos Arturo Ramírez', estado: 'Asignada', cartera: 0 },
  { id: 'U-D-045', unidad: 'D-045', torre: 'B', tipo: 'Depósito', coef: 0.1893, area: 5, propietario: 'Diana Marcela Peña', estado: 'Asignada', cartera: 0 },
  { id: 'U-301', unidad: '301', torre: 'A', tipo: 'Apartamento', coef: 1.0501, area: 70, propietario: 'Andrés Felipe Molina', estado: 'Ocupada', cartera: 0 },
  { id: 'U-201', unidad: '201', torre: 'B', tipo: 'Apartamento', coef: 1.0308, area: 66, propietario: 'Lucía Fernanda Gómez', estado: 'Ocupada', cartera: 0 },
  { id: 'U-305', unidad: '305', torre: 'C', tipo: 'Apartamento', coef: 1.1120, area: 74, propietario: 'Carmen Helena Ruiz', estado: 'Ocupada', cartera: 0 },
  { id: 'U-808', unidad: '808', torre: 'C', tipo: 'Apartamento', coef: 1.1201, area: 75, propietario: 'Héctor Aníbal Restrepo', estado: 'Ocupada', cartera: 2_300_000 },
  { id: 'U-802', unidad: '802', torre: 'D', tipo: 'Apartamento', coef: 1.0090, area: 62, propietario: 'Yolanda Patiño Lozada', estado: 'Ocupada', cartera: 0 },
  { id: 'U-305D', unidad: '305', torre: 'D', tipo: 'Apartamento', coef: 0.9985, area: 63, propietario: 'Rubén Darío Castaño', estado: 'Ocupada', cartera: 4_100_000 },
];

export const PROPIETARIOS = [
  { id: 1, nombre: 'Carlos Arturo Ramírez', documento: 'CC 79.456.123', unidades: '501-A, P-118', telefono: '310 456 7890', email: 'c.ramirez@correo.co', estado: 'Al día' },
  { id: 2, nombre: 'Diana Marcela Peña', documento: 'CC 52.348.987', unidades: '502-B, D-045', telefono: '315 234 1123', email: 'diana.pena@correo.co', estado: 'Al día' },
  { id: 3, nombre: 'Jorge Enrique Salazar', documento: 'CC 80.117.654', unidades: '1103-A', telefono: '320 678 4433', email: 'jsalazar@correo.co', estado: 'En mora' },
  { id: 4, nombre: 'Sandra Lucía Contreras', documento: 'CC 53.902.321', unidades: '804-A', telefono: '300 112 8899', email: 'slu.contreras@correo.co', estado: 'En mora' },
  { id: 5, nombre: 'Ricardo Antonio Nieto', documento: 'CC 71.445.902', unidades: '1201-C', telefono: '318 556 0011', email: 'rnieto@correo.co', estado: 'En mora' },
  { id: 6, nombre: 'Panadería La Espiga S.A.S', documento: 'NIT 900.888.112-4', unidades: 'LC-03', telefono: '601 745 2211', email: 'admin@laespiga.co', estado: 'Al día' },
];

/**
 * Personas vinculadas a unidades (titularidad u ocupación).
 * Una fila = vínculo persona–unidad: la misma persona puede aparecer en varias.
 * Alimenta la grilla "Personas de la copropiedad" de la pantalla Estructura,
 * filtrable por torre y por rol, y clicable hacia el detalle (drawer lateral).
 */
export const PERSONAS = [
  // Torre A
  { id: 'PP-001', nombre: 'Carlos Arturo Ramírez', documento: 'CC 79.456.123', rol: 'Propietario', unidad: '501-A', unitId: 'U-501', telefono: '310 456 7890', email: 'c.ramirez@correo.co', ingreso: '2021-03-14', estado: 'Al día', detalle: 'Propietario residente', cartera: 0, emergencia: 'Mariana Ramírez López · 310 456 7811' },
  { id: 'PP-002', nombre: 'Mariana Ramírez López', documento: 'CC 1.020.445.901', rol: 'Habitante', unidad: '501-A', unitId: 'U-501', telefono: '310 456 7811', email: 'm.ramirez@correo.co', ingreso: '2021-03-14', estado: 'Activo', detalle: 'Ocupante autorizado (hija)', emergencia: 'Carlos Arturo Ramírez · 310 456 7890' },
  { id: 'PP-003', nombre: 'Andrés Felipe Molina', documento: 'CC 80.341.556', rol: 'Propietario', unidad: '301-A', unitId: 'U-301', telefono: '300 214 8890', email: 'a.molina@correo.co', ingreso: '2024-02-01', estado: 'Al día', detalle: 'Propietario residente', cartera: 0, emergencia: 'Mariana Torres Molina · 300 214 8891' },
  { id: 'PP-004', nombre: 'Mariana Torres Molina', documento: 'CC 52.118.774', rol: 'Habitante', unidad: '301-A', unitId: 'U-301', telefono: '300 214 8891', email: 'm.torres@correo.co', ingreso: '2024-02-01', estado: 'Activo', detalle: 'Ocupante autorizado (cónyuge)', emergencia: 'Andrés Felipe Molina · 300 214 8890' },
  { id: 'PP-005', nombre: 'Sandra Lucía Contreras', documento: 'CC 53.902.321', rol: 'Propietario', unidad: '804-A', unitId: 'U-804', telefono: '300 112 8899', email: 'slu.contreras@correo.co', ingreso: '2019-08-30', estado: 'En mora', detalle: 'Propietaria residente', cartera: 950_000, emergencia: 'Julián Contreras Roca · 300 112 8800' },
  { id: 'PP-006', nombre: 'Julián Contreras Roca', documento: 'CC 79.664.120', rol: 'Habitante', unidad: '804-A', unitId: 'U-804', telefono: '300 112 8800', email: 'j.contreras@correo.co', ingreso: '2022-11-05', estado: 'Activo', detalle: 'Ocupante autorizado (cónyuge)', emergencia: 'Sandra Lucía Contreras · 300 112 8899' },
  { id: 'PP-007', nombre: 'Jorge Enrique Salazar', documento: 'CC 80.117.654', rol: 'Propietario', unidad: '1103-A', unitId: 'U-1103', telefono: '320 678 4433', email: 'jsalazar@correo.co', ingreso: '2017-06-12', estado: 'En mora', detalle: 'Propietario (no residente)', cartera: 2_850_000, emergencia: 'Luz Marina Gómez · 320 678 4400' },
  { id: 'PP-008', nombre: 'Diana Milena Cruz', documento: 'CC 52.330.981', rol: 'Encargado', unidad: '1103-A', unitId: 'U-1103', telefono: '311 905 6677', email: 'diana.cruz.gestora@correo.co', ingreso: '2023-05-11', estado: 'Activo', detalle: 'Gestora inmobiliaria · apoderada', emergencia: 'Inmobiliaria del Norte · 601 555 0123' },
  { id: 'PP-009', nombre: 'Luz Marina Gómez', documento: 'CC 40.112.328', rol: 'Arrendatario', unidad: '1103-A', unitId: 'U-1103', telefono: '320 678 4400', email: 'l.gomez.1103@correo.co', ingreso: '2023-05-11', estado: 'Activo', detalle: 'Arrendataria principal del apartamento', contrato: { numero: 'CONT-2023-118', inicio: '2023-05-11', fin: '2026-05-10', canon: 2_400_000 }, emergencia: 'Jorge Enrique Salazar · 320 678 4433' },
  // Torre B
  { id: 'PP-010', nombre: 'Diana Marcela Peña', documento: 'CC 52.348.987', rol: 'Propietario', unidad: '502-B', unitId: 'U-502', telefono: '315 234 1123', email: 'diana.pena@correo.co', ingreso: '2022-07-01', estado: 'Al día', detalle: 'Propietaria residente', cartera: 0, emergencia: 'Camilo Torres Peña · 315 234 1100' },
  { id: 'PP-011', nombre: 'Camilo Torres Peña', documento: 'CC 1.023.876.112', rol: 'Habitante', unidad: '502-B', unitId: 'U-502', telefono: '315 234 1100', email: 'c.torres@correo.co', ingreso: '2024-01-20', estado: 'Activo', detalle: 'Ocupante autorizado (hijo)', emergencia: 'Diana Marcela Peña · 315 234 1123' },
  { id: 'PP-012', nombre: 'Lucía Fernanda Gómez', documento: 'CC 43.987.112', rol: 'Propietario', unidad: '201-B', unitId: 'U-201', telefono: '318 700 2211', email: 'l.gomez.201@correo.co', ingreso: '2023-09-15', estado: 'Al día', detalle: 'Propietaria residente', cartera: 0, emergencia: 'Esteban Gómez Ríos · 318 700 2212' },
  { id: 'PP-013', nombre: 'Esteban Gómez Ríos', documento: 'CC 1.018.443.907', rol: 'Habitante', unidad: '201-B', unitId: 'U-201', telefono: '318 700 2212', email: 'e.gomez@correo.co', ingreso: '2023-09-15', estado: 'Activo', detalle: 'Ocupante autorizado (hijo)', emergencia: 'Lucía Fernanda Gómez · 318 700 2211' },
  // Torre C
  { id: 'PP-014', nombre: 'Ricardo Antonio Nieto', documento: 'CC 71.445.902', rol: 'Propietario', unidad: '1201-C', unitId: 'U-1201', telefono: '318 556 0011', email: 'rnieto@correo.co', ingreso: '2019-08-30', estado: 'En mora', detalle: 'Propietario (no residente)', cartera: 5_700_000, emergencia: 'Fabián Nieto Ortiz · 318 556 0022' },
  { id: 'PP-015', nombre: 'Fabián Nieto Ortiz', documento: 'CC 1.020.118.445', rol: 'Encargado', unidad: '1201-C', unitId: 'U-1201', telefono: '318 556 0022', email: 'f.nieto@correo.co', ingreso: '2025-02-10', estado: 'Activo', detalle: 'Apoderado · administrador de la unidad', emergencia: 'Ricardo Antonio Nieto · 318 556 0011' },
  { id: 'PP-016', nombre: 'Carmen Helena Ruiz', documento: 'CC 41.209.883', rol: 'Propietario', unidad: '305-C', unitId: 'U-305', telefono: '320 445 9087', email: 'carmen.ruiz@correo.co', ingreso: '2020-04-18', estado: 'Al día', detalle: 'Propietaria residente', cartera: 0, emergencia: 'Andrés Felipe Cruz Ruiz · 320 445 9088' },
  { id: 'PP-017', nombre: 'Andrés Felipe Cruz Ruiz', documento: 'CC 1.014.556.231', rol: 'Habitante', unidad: '305-C', unitId: 'U-305', telefono: '320 445 9088', email: 'af.cruz@correo.co', ingreso: '2020-04-18', estado: 'Activo', detalle: 'Ocupante autorizado (hijo)', emergencia: 'Carmen Helena Ruiz · 320 445 9087' },
  { id: 'PP-018', nombre: 'Samuel Restrepo Villa', documento: 'CC 71.113.908', rol: 'Arrendatario', unidad: '808-C', unitId: 'U-808', telefono: '312 778 4521', email: 'sam.restrepo@correo.co', ingreso: '2025-06-01', estado: 'Activo', detalle: 'Arrendatario principal', contrato: { numero: 'CONT-2025-041', inicio: '2025-06-01', fin: '2026-05-31', canon: 1_850_000 }, emergencia: 'Patricia Restrepo León · 312 778 4522' },
  { id: 'PP-019', nombre: 'Patricia Restrepo León', documento: 'CC 40.556.712', rol: 'Habitante', unidad: '808-C', unitId: 'U-808', telefono: '312 778 4522', email: 'p.restrepo@correo.co', ingreso: '2025-06-01', estado: 'Activo', detalle: 'Cónyuge · cotitular del arrendamiento', emergencia: 'Samuel Restrepo Villa · 312 778 4521' },
  // Torre D
  { id: 'PP-020', nombre: 'Yolanda Patiño Lozada', documento: 'CC 51.880.219', rol: 'Propietario', unidad: '802-D', unitId: 'U-802', telefono: '300 664 1120', email: 'y.patino@correo.co', ingreso: '2021-11-27', estado: 'Al día', detalle: 'Propietaria residente', cartera: 0, emergencia: 'Óscar Patiño Ríos · 300 664 1121' },
  { id: 'PP-021', nombre: 'Óscar Patiño Ríos', documento: 'CC 1.019.227.665', rol: 'Habitante', unidad: '802-D', unitId: 'U-802', telefono: '300 664 1121', email: 'o.patino@correo.co', ingreso: '2023-03-08', estado: 'Activo', detalle: 'Ocupante autorizado (hijo)', emergencia: 'Yolanda Patiño Lozada · 300 664 1120' },
  { id: 'PP-022', nombre: 'Rubén Darío Castaño', documento: 'CC 71.990.112', rol: 'Propietario', unidad: '305-D', unitId: 'U-305D', telefono: '315 902 3344', email: 'r.dcastano@correo.co', ingreso: '2018-12-01', estado: 'En mora', detalle: 'Propietario (no residente)', cartera: 4_100_000, emergencia: 'Marcela Castaño Peña · 315 902 3355' },
  { id: 'PP-023', nombre: 'Marcela Castaño Peña', documento: 'CC 52.771.908', rol: 'Encargado', unidad: '305-D', unitId: 'U-305D', telefono: '315 902 3355', email: 'm.castano@correo.co', ingreso: '2024-07-19', estado: 'Activo', detalle: 'Administradora delegada de la unidad', emergencia: 'Rubén Darío Castaño · 315 902 3344' },
  // Locales comerciales
  { id: 'PP-024', nombre: 'Panadería La Espiga S.A.S', documento: 'NIT 900.888.112-4', rol: 'Propietario', unidad: 'LC-03', unitId: 'U-LC-03', telefono: '601 745 2211', email: 'admin@laespiga.co', ingreso: '2016-05-01', estado: 'En mora', detalle: 'Titular jurídico del local', cartera: 1_450_000, emergencia: 'Héctor Iván Suárez · 601 745 2212' },
  { id: 'PP-025', nombre: 'Héctor Iván Suárez', documento: 'CC 79.112.556', rol: 'Encargado', unidad: 'LC-03', unitId: 'U-LC-03', telefono: '601 745 2212', email: 'hector.suarez@laespiga.co', ingreso: '2023-02-13', estado: 'Activo', detalle: 'Administrador del local', emergencia: 'Panadería La Espiga S.A.S · 601 745 2211' },
];

export const RESIDENTES = [
  { id: 1, nombre: 'Carlos Arturo Ramírez', unidad: '501-A', tipo: 'Propietario residente', telefono: '310 456 7890', ingreso: '2021-03-14', estado: 'Activo' },
  { id: 2, nombre: 'Mariana Ramírez López', unidad: '501-A', tipo: 'Ocupante autorizado', telefono: '310 456 7811', ingreso: '2021-03-14', estado: 'Activo' },
  { id: 3, nombre: 'Diana Marcela Peña', unidad: '502-B', tipo: 'Propietario residente', telefono: '315 234 1123', ingreso: '2022-07-01', estado: 'Activo' },
  { id: 4, nombre: 'Camilo Torres Peña', unidad: '502-B', tipo: 'Ocupante autorizado', telefono: '315 234 1100', ingreso: '2024-01-20', estado: 'Activo' },
  { id: 5, nombre: 'Jorge Enrique Salazar', unidad: '1103-A', tipo: 'Arrendatario', telefono: '320 678 4433', ingreso: '2023-05-11', estado: 'Activo' },
  { id: 6, nombre: 'Luz Marina Gómez', unidad: '1103-A', tipo: 'Arrendataria', telefono: '320 678 4400', ingreso: '2023-05-11', estado: 'Activo' },
  { id: 7, nombre: 'Ricardo Antonio Nieto', unidad: '1201-C', tipo: 'Propietario (no residente)', telefono: '318 556 0011', ingreso: '—', estado: 'Inactivo' },
];

export const USUARIOS = [
  { id: 1, nombre: 'Laura Gómez Restrepo', email: 'lgomez@urbania.co', rol: 'Administrador', ultimoAcceso: '2026-11-03 07:55', estado: 'Activo' },
  { id: 2, nombre: 'Andrés Ruiz Cardona', email: 'aruiz@urbania.co', rol: 'Administrador', ultimoAcceso: '2026-11-02 18:30', estado: 'Activo' },
  { id: 3, nombre: 'Marcela Torres', email: 'mtorres@consejo.altosdelparque.co', rol: 'Consejo', ultimoAcceso: '2026-11-02 16:05', estado: 'Activo' },
  { id: 4, nombre: 'Felipe Osorio', email: 'fosorio@altosdelparque.co', rol: 'Contador', ultimoAcceso: '2026-11-01 09:12', estado: 'Activo' },
  { id: 5, nombre: 'Portería Turno A', email: 'porteria.a@altosdelparque.co', rol: 'Portería', ultimoAcceso: '2026-11-03 08:00', estado: 'Activo' },
  { id: 6, nombre: 'Portería Turno B', email: 'porteria.b@altosdelparque.co', rol: 'Portería', ultimoAcceso: '2026-11-02 22:05', estado: 'Activo' },
  { id: 7, nombre: 'Carlos Ramírez', email: 'c.ramirez@correo.co', rol: 'Residente', ultimoAcceso: '2026-10-28 19:40', estado: 'Activo' },
  { id: 8, nombre: 'ServiClean S.A.S', email: 'operaciones@serviclean.co', rol: 'Proveedor', ultimoAcceso: '2026-10-25 08:10', estado: 'Inactivo' },
];

export const VEHICULOS = [
  { placa: 'KTR-482', marca: 'Mazda 3', color: 'Gris', unidad: '501-A', propietario: 'Carlos Arturo Ramírez', tipo: 'Automóvil' },
  { placa: 'MNV-213', marca: 'Renault Duster', color: 'Blanco', unidad: '502-B', propietario: 'Diana Marcela Peña', tipo: 'SUV' },
  { placa: 'HJD-990', marca: 'Chevrolet Spark', color: 'Rojo', unidad: 'LC-03', propietario: 'Panadería La Espiga', tipo: 'Automóvil' },
  { placa: 'WQ-4521', marca: 'Yamaha FZ', color: 'Negro', unidad: '1103-A', propietario: 'Jorge Enrique Salazar', tipo: 'Motocicleta' },
  { placa: 'PBX-107', marca: 'Toyota Hilux', color: 'Plata', unidad: '804-A', propietario: 'Sandra Lucía Contreras', tipo: 'Camioneta' },
];

/** Inventario de parqueaderos privatizados (coherente con 8 unidades tipo Parqueadero del catálogo). */
export const PARQUEADEROS = [
  { id: 'P-101', espacio: 'P-101', nivel: '-1', unidad: '501-A', titular: 'Carlos Arturo Ramírez', vehiculo: 'KTR-482 · Mazda 3', tipo: 'Propietario', desde: '2021-03-14', tarifa: 185_000, tarifaHora: 3_200, tarjeta: 'TGT-4471', estado: 'Residencial', destinacion: 'Privado', ubicacion: 'S1 · Zona A', estadoFisico: 'Operativo', estadoAsignacion: 'Asignado', origen: 'Uso exclusivo', vigencia: 'Indefinida' },
  { id: 'P-102', espacio: 'P-102', nivel: '-1', unidad: '502-B', titular: 'Diana Marcela Peña', vehiculo: 'MNV-213 · Renault Duster', tipo: 'Propietario', desde: '2022-07-01', tarifa: 185_000, tarifaHora: 3_200, tarjeta: 'TGT-3390', estado: 'Residencial', destinacion: 'Privado', ubicacion: 'S1 · Zona A', estadoFisico: 'Operativo', estadoAsignacion: 'Asignado', origen: 'Uso exclusivo', vigencia: 'Indefinida' },
  { id: 'P-103', espacio: 'P-103', nivel: '-1', unidad: '1103-A', titular: 'Jorge Enrique Salazar', vehiculo: 'WQ-4521 · Yamaha FZ', tipo: 'Arrendatario', desde: '2023-05-11', tarifa: 80_000, tarifaHora: 3_200, tarjeta: 'TGT-2210', estado: 'Residencial', destinacion: 'Comunal', ubicacion: 'S1 · Zona B', estadoFisico: 'Operativo', estadoAsignacion: 'Asignado', origen: 'Sorteo 2025-B', vigencia: '01/06/26 – 31/05/27' },
  { id: 'P-104', espacio: 'P-104', nivel: '-1', unidad: null, titular: null, vehiculo: null, tipo: null, desde: null, tarifa: 185_000, tarifaHora: 3_200, tarjeta: null, estado: 'En reparación', destinacion: 'Comunal', ubicacion: 'S2 · Zona C', estadoFisico: 'Mantenimiento', estadoAsignacion: 'Restringido', origen: null, vigencia: null },
  { id: 'P-105', espacio: 'P-105', nivel: '-1', unidad: null, titular: null, vehiculo: null, tipo: null, desde: null, tarifa: 45_000, tarifaHora: 3_200, tarjeta: null, estado: 'Visita', destinacion: 'Visitantes', ubicacion: 'Acceso principal', estadoFisico: 'Operativo', estadoAsignacion: 'Disponible', origen: null, vigencia: null },
  { id: 'P-201', espacio: 'P-201', nivel: '-2', unidad: '1201-C', titular: 'Ricardo Antonio Nieto', vehiculo: null, tipo: 'Propietario', desde: '2019-08-30', tarifa: 65_000, tarifaHora: 3_200, tarjeta: 'TGT-5521', estado: 'Residencial', destinacion: 'Uso exclusivo', ubicacion: 'S2 · Zona B', estadoFisico: 'Operativo', estadoAsignacion: 'Asignado', origen: 'Contrato', vigencia: '01/02/26 – 31/01/27' },
  { id: 'M-01', espacio: 'M-01', nivel: 'Motos', unidad: '1103-A', titular: 'Jorge Enrique Salazar', vehiculo: 'WQ-4521 · Yamaha FZ', tipo: 'Arrendatario', desde: '2023-05-11', tarifa: 45_000, tarifaHora: 1_600, tarjeta: 'TGT-2211', estado: 'Residencial', destinacion: 'Comunal', ubicacion: 'Motos', estadoFisico: 'Operativo', estadoAsignacion: 'Asignado', origen: 'Sorteo 2025-B', vigencia: '01/06/26 – 31/05/27' },
  { id: 'M-02', espacio: 'M-02', nivel: 'Motos', unidad: null, titular: null, vehiculo: null, tipo: null, desde: null, tarifa: 92_000, tarifaHora: 1_600, tarjeta: null, estado: 'Disponible', destinacion: 'Comunal', ubicacion: 'Motos', estadoFisico: 'Operativo', estadoAsignacion: 'Disponible', origen: null, vigencia: null },
];

/** Convocatorias para espacios comunales y de visitantes. */
export const PARQUEADERO_CONVOCATORIAS = [
  { id: 'C-2027A', nombre: 'Comunal 2027-A', tipo: 'Convocatoria semestral', periodo: '01 ene – 15 ene 2027', espacios: 2, solicitudes: '54 validadas / 61', estado: 'Inscripción cerrada' },
  { id: 'C-2026B', nombre: 'Comunal 2026-B', tipo: 'Convocatoria semestral', periodo: '01 jul – 15 jul 2026', espacios: 2, solicitudes: '49', estado: 'Finalizada' },
  { id: 'C-2026V', nombre: 'Visitantes temporada', tipo: 'Uso temporal', periodo: 'Vigencia continua', espacios: 1, solicitudes: 'No aplica', estado: 'Activa' },
];

/** Cargos de parqueadero del período Nov-2026 (para pestaña Cobros y recaudos). */
export const PARQUEADERO_CARGOS = [
  { id: 'CH-0118', unidad: '1103-A', espacio: 'P-103', concepto: 'Cuota de asignación comunal', periodo: 'Nov 2026', valor: 80_000, vencimiento: '10/11/26', estado: 'Pendiente' },
  { id: 'CH-0119', unidad: '502-B', espacio: 'P-102', concepto: 'Cuota de asignación comunal', periodo: 'Nov 2026', valor: 80_000, vencimiento: '10/11/26', estado: 'Pagado' },
  { id: 'CH-0114', unidad: '1201-C', espacio: 'P-201', concepto: 'Compensación uso exclusivo', periodo: 'Oct 2026', valor: 65_000, vencimiento: '31/10/26', estado: 'Vencido' },
  { id: 'CH-0112', unidad: '1103-A', espacio: 'M-01', concepto: 'Cuota de asignación comunal', periodo: 'Nov 2026', valor: 45_000, vencimiento: '10/11/26', estado: 'Pagado' },
];

/** Tarifas configuradas por tipo de espacio. */
export const PARQUEADERO_TARIFAS = [
  { id: 'T-01', concepto: 'Cuota de asignación comunal', tipoEspacio: 'Comunal por sorteo', periodicidad: 'Mensual', valor: '$ 80.000', vigencia: '2026-2', estado: 'Activa' },
  { id: 'T-02', concepto: 'Compensación de uso exclusivo', tipoEspacio: 'Común uso exclusivo', periodicidad: 'Mensual', valor: '$ 65.000', vigencia: '2026', estado: 'Activa' },
  { id: 'T-03', concepto: 'Canon de alquiler', tipoEspacio: 'Común explotable', periodicidad: 'Mensual', valor: '$ 120.000', vigencia: 'Contrato', estado: 'Activa' },
  { id: 'T-04', concepto: 'Uso temporal visitante', tipoEspacio: 'Visitantes', periodicidad: 'Por hora', valor: '$ 3.200', vigencia: 'Configuración', estado: 'Revisar autorización' },
];

/** Recaudos de parqueadero aplicados recientemente. */
export const PARQUEADERO_RECAUDOS = [
  { id: 'REC-PQ-0182', fecha: '2026-11-03', unidad: '502-B', referencia: 'REC-PQ-0182', medio: 'Transferencia', valor: 80_000, registrado: 'Administración' },
  { id: 'REC-PQ-0179', fecha: '2026-11-02', unidad: '1103-A', referencia: 'REC-PQ-0179', medio: 'Consignación', valor: 45_000, registrado: 'Administración' },
];

/** Trazabilidad administrativa y económica del módulo. */
export const PARQUEADERO_HISTORIAL = [
  { id: 'H-1', fecha: '2026-11-04 09:32', evento: 'Asignación', objeto: 'P-103', detalle: 'Asignado a 1103-A · Sorteo 2025-B', usuario: 'Admin general', soporte: 'ACT-2026-044' },
  { id: 'H-2', fecha: '2026-11-03 16:12', evento: 'Recaudo', objeto: '502-B', detalle: 'Pago aplicado por $ 80.000', usuario: 'Auxiliar', soporte: 'REC-PQ-0182' },
  { id: 'H-3', fecha: '2026-11-01 11:05', evento: 'Estado', objeto: 'P-104', detalle: 'Bloqueado por mantenimiento', usuario: 'Admin general', soporte: 'OT-0098' },
  { id: 'H-4', fecha: '2026-10-20 14:30', evento: 'Sorteo', objeto: 'Comunal 2027-A', detalle: 'Resultado publicado y acta adjunta', usuario: 'Admin general', soporte: 'ACT-SOR-027' },
];

export const PARQUEADERO_VISITAS = [
  { id: 'PV-0312', ingreso: '2026-11-03 08:14', visitante: 'Gloria Restrepo', placa: 'XYZ-784', vehiculo: 'Automóvil', horas: 3.5, cobro: 11_200, estado: 'Cerrada' },
  { id: 'PV-0313', ingreso: '2026-11-03 09:02', visitante: 'Carlos Villa', placa: 'KLM-221', vehiculo: 'Automóvil', horas: null, cobro: null, estado: 'En curso' },
  { id: 'PV-0314', ingreso: '2026-11-03 10:41', visitante: 'Daniel Ríos', placa: 'PQR-105', vehiculo: 'Motocicleta', horas: 1.0, cobro: 1_600, estado: 'Cerrada' },
  { id: 'PV-0315', ingreso: '2026-11-03 11:20', visitante: 'Yolanda Pradilla', placa: 'WER-310', vehiculo: 'Automóvil', horas: null, cobro: null, estado: 'En curso' },
  { id: 'PV-0311', ingreso: '2026-11-02 18:33', visitante: 'Martha Londoño', placa: 'BNC-903', vehiculo: 'Automóvil', horas: 9.2, cobro: 29_440, estado: 'Superó 24 h' },
];

export const MASCOTAS = [
  { nombre: 'Nara', especie: 'Perro', raza: 'Cocker Spaniel', unidad: '501-A', responsable: 'Carlos Arturo Ramírez', vacunas: 'Al día' },
  { nombre: 'Michi', especie: 'Gato', raza: 'Mestizo', unidad: '502-B', responsable: 'Diana Marcela Peña', vacunas: 'Al día' },
  { nombre: 'Rocky', especie: 'Perro', raza: 'Pastor Alemán', unidad: '1103-A', responsable: 'Jorge Enrique Salazar', vacunas: 'Vencidas' },
  { nombre: 'Kira', especie: 'Perro', raza: 'Caniche', unidad: '804-A', responsable: 'Sandra Lucía Contreras', vacunas: 'Al día' },
];

export const PROVEEDORES = [
  { id: 1, nombre: 'ServiClean S.A.S', servicio: 'Aseo y cafetería', contacto: 'Andrea Molina · 310 882 1123', contratos: 2, estado: 'Vigente', nit: '900.456.221-7' },
  { id: 2, nombre: 'Ascensores OTIS Colombia', servicio: 'Mantenimiento de ascensores', contacto: 'Óscar Tavera · 601 552 8899', contratos: 1, estado: 'Vigente', nit: '860.221.334-1' },
  { id: 3, nombre: 'Piscinas Claras Ltda', servicio: 'Mantenimiento piscina', contacto: 'Deisy Ríos · 311 445 6677', contratos: 1, estado: 'Vigente', nit: '901.332.118-5' },
  { id: 4, nombre: 'Eléctricos Andina S.A', servicio: 'Instalaciones eléctricas', contacto: 'Héctor Duarte · 320 998 1122', contratos: 0, estado: 'En revisión', nit: '830.774.551-0' },
  { id: 5, nombre: 'Inmobiliaria Vivir', servicio: 'Arrendamientos', contacto: 'Paola Ibáñez · 315 667 1234', contratos: 0, estado: 'Suspendido', nit: '901.112.908-2' },
];

export const PERSONAL = [
  { id: 1, nombre: 'Portería Turno A', cargo: 'Conserje', turno: 'Lun–Vie 6:00–14:00', contacto: '601 745 0001', documentos: 'Al día' },
  { id: 2, nombre: 'Portería Turno B', cargo: 'Conserje', turno: 'Lun–Vie 14:00–22:00', contacto: '601 745 0002', documentos: 'Al día' },
  { id: 3, nombre: 'Jaime Arias', cargo: 'Jefe de mantenimiento', turno: 'Lun–Sáb 7:00–17:00', contacto: '311 220 8899', documentos: 'Al día' },
  { id: 4, nombre: 'Rosa Estupiñán', cargo: 'Auxiliar de aseo', turno: 'Lun–Sáb 6:00–12:00', contacto: '312 445 9012', documentos: 'Vencen en 20 días' },
  { id: 5, nombre: 'Néstor Beltrán', cargo: 'Jardinero', turno: 'Mar–Sáb 7:00–15:00', contacto: '313 778 1234', documentos: 'Al día' },
];

export const AQRS = [
  { id: 'PQRS-2026-0187', fecha: '2026-11-02', unidad: '1103-A', tipo: 'Queja', asunto: 'Ruido excesivo fin de semana — Apto 1105', estado: 'En trámite', prioridad: 'Alta', responsable: 'Laura Gómez', sla: 'Vence hoy' },
  { id: 'PQRS-2026-0186', fecha: '2026-11-01', unidad: '502-B', tipo: 'Petición', asunto: 'Solicitud de constancia de residencia', estado: 'Respondida', prioridad: 'Normal', responsable: 'Laura Gómez', sla: 'Cumplido' },
  { id: 'PQRS-2026-0185', fecha: '2026-10-31', unidad: 'LC-03', tipo: 'Reclamo', asunto: 'Fuga en tubería local comercial', estado: 'En trámite', prioridad: 'Alta', responsable: 'Jaime Arias', sla: 'Vence en 1 día' },
  { id: 'PQRS-2026-0184', fecha: '2026-10-30', unidad: '804-A', tipo: 'Sugerencia', asunto: 'Horario extendido salón social', estado: 'Cerrada', prioridad: 'Normal', responsable: 'Consejo', sla: 'Cumplido' },
  { id: 'PQRS-2026-0183', fecha: '2026-10-29', unidad: '501-A', tipo: 'Felicitación', asunto: 'Excelente atención de portería', estado: 'Cerrada', prioridad: 'Normal', responsable: 'Laura Gómez', sla: 'Cumplido' },
  { id: 'PQRS-2026-0182', fecha: '2026-10-28', unidad: '1201-C', tipo: 'Queja', asunto: 'Filtración techo parqueadero', estado: 'Pendiente', prioridad: 'Urgente', responsable: 'Jaime Arias', sla: 'Vencida' },
];

export const ORDENES = [
  { id: 'OT-2026-0141', fecha: '2026-11-02', titulo: 'Reparación ascensor Torre C', asignado: 'Ascensores OTIS', prioridad: 'Urgente', estado: 'Cerrada', avance: 100 },
  { id: 'OT-2026-0142', fecha: '2026-11-02', titulo: 'Fuga tubería LC-03', asignado: 'Eléctricos Andina', prioridad: 'Alta', estado: 'En progreso', avance: 45 },
  { id: 'OT-2026-0143', fecha: '2026-11-01', titulo: 'Pintura fachada Torre B', asignado: 'ServiClean', prioridad: 'Normal', estado: 'Programada', avance: 0 },
  { id: 'OT-2026-0144', fecha: '2026-10-31', titulo: 'Mantenimiento piscina — cloración', asignado: 'Piscinas Claras', prioridad: 'Normal', estado: 'En progreso', avance: 70 },
  { id: 'OT-2026-0145', fecha: '2026-10-30', titulo: 'Cambio luminarias parqueadero sótano', asignado: 'Eléctricos Andina', prioridad: 'Alta', estado: 'Pendiente', avance: 10 },
];

export const VISITANTES = [
  { id: 'V-8891', hora: '08:12', nombre: 'Miguel Ángel Parra', documento: 'CC 1.098.776.211', unidad: '1103-A', motivo: 'Despacho de mensajería', anfitrion: 'Jorge Salazar', autorizacion: 'Autorizado (QR 88412)', estado: 'Dentro' },
  { id: 'V-8890', hora: '07:48', nombre: 'Sandra Milena Prieto', documento: 'CC 52.667.120', unidad: '501-A', motivo: 'Empleada de servicio', anfitrion: 'Carlos Ramírez', autorizacion: 'Permanente', estado: 'Dentro' },
  { id: 'V-8889', hora: '07:30', nombre: 'Domicilio — Rappi', documento: '—', unidad: '502-B', motivo: 'Entrega de pedido', anfitrion: 'Diana Peña', autorizacion: 'Autorizado (código 1198)', estado: 'Salió 07:52' },
  { id: 'V-8888', hora: '06:55', nombre: 'Técnicos — OTIS', documento: 'TE-3321', unidad: 'Zona común', motivo: 'Mantenimiento ascensores', anfitrion: 'Jaime Arias', autorizacion: 'Proveedor aprobado', estado: 'Dentro' },
];

export const PAQUETES = [
  { id: 'PKG-2291', fecha: '2026-11-03 07:20', unidad: '501-A', descripcion: 'Caja grande — Alkosto', transportadora: 'Servientrega', estado: 'Notificado', receptor: '—' },
  { id: 'PKG-2290', fecha: '2026-11-02 18:40', unidad: '804-A', descripcion: 'Sobre — Banco de Bogotá', transportadora: 'Mensajeros Urbanos', estado: 'Entregado', receptor: 'Sandra Contreras' },
  { id: 'PKG-2289', fecha: '2026-11-02 15:12', unidad: '1103-A', descripcion: 'Caja mediana — Mercado Libre', transportadora: 'Coordinadora', estado: 'Notificado', receptor: '—' },
  { id: 'PKG-2288', fecha: '2026-11-01 09:05', unidad: 'LC-03', descripcion: 'Bulto — Insumos panadería', transportadora: 'TCC', estado: 'Entregado', receptor: 'Panadería La Espiga' },
];

export const CONCEPTOS_COBRO = [
  { id: 1, nombre: 'Administración ordinaria', periodicidad: 'Mensual', valorTipo: 'Por coeficiente', cuenta: '4135-01', estado: 'Activo' },
  { id: 2, nombre: 'Cuota extraordinaria impermeabilización', periodicidad: 'Única (Nov-2026)', valorTipo: 'Valor fijo $ 120.000', cuenta: '4135-09', estado: 'Activo' },
  { id: 3, nombre: 'Parqueadero visitantes', periodicidad: 'Mensual', valorTipo: 'Valor fijo $ 45.000', cuenta: '4135-02', estado: 'Activo' },
  { id: 4, nombre: 'Intereses de mora', periodicidad: 'Eventual', valorTipo: '1.5% / mes', cuenta: '4195-01', estado: 'Activo' },
  { id: 5, nombre: 'Sanción de convivencia', periodicidad: 'Eventual', valorTipo: 'Según reglamento', cuenta: '4170-01', estado: 'Inactivo' },
];

export const CARTERA_DETALLE = [
  { unidad: '1201-C', propietario: 'Ricardo Antonio Nieto', capital: 5_700_000, intereses: 642_000, vencida: 141, estado: 'Más de 90 días' },
  { unidad: '1103-A', propietario: 'Jorge Enrique Salazar', capital: 2_850_000, intereses: 285_000, vencida: 63, estado: '61 – 90 días' },
  { unidad: '804-A', propietario: 'Sandra Lucía Contreras', capital: 950_000, intereses: 57_000, vencida: 34, estado: '31 – 60 días' },
  { unidad: 'LC-03', propietario: 'Panadería La Espiga S.A.S', capital: 1_450_000, intereses: 72_500, vencida: 12, estado: '1 – 30 días' },
  { unidad: '702-B', propietario: 'María C. Holguín', capital: 2_850_000, intereses: 428_000, vencida: 118, estado: 'Más de 90 días' },
];

export const PAGOS_RECIENTES = [
  { id: 'REC-9931', fecha: '2026-11-03 08:12', unidad: '502-B', concepto: 'Administración Nov-2026', valor: 760_000, medio: 'PSE', soporte: 'Extracto #4471' },
  { id: 'REC-9930', fecha: '2026-11-02 17:26', unidad: 'LC-03', concepto: 'Parqueadero Oct + mora', valor: 1_450_000, medio: 'Transferencia', soporte: 'TR-88122' },
  { id: 'REC-9929', fecha: '2026-11-02 11:03', unidad: '501-A', concepto: 'Administración Nov-2026', valor: 712_000, medio: 'Débito automático', soporte: 'DA-2201' },
  { id: 'REC-9928', fecha: '2026-11-01 09:40', unidad: '804-A', concepto: 'Abono a acuerdo #PA-017', valor: 500_000, medio: 'Efectivo', soporte: 'Recibo 1145' },
];

export const ASAMBLEAS = [
  { id: 'AS-2026-01', nombre: 'Asamblea ordinaria 2026', fecha: '2026-03-21', modalidad: 'Presencial + virtual', estado: 'Realizada', quórum: 78.4 },
  { id: 'AS-2026-02', nombre: 'Asamblea extraordinaria impermeabilización', fecha: '2026-09-12', modalidad: 'Virtual', estado: 'Realizada', quórum: 81.2 },
  { id: 'AS-2027-01', nombre: 'Asamblea ordinaria 2027', fecha: '2027-03-20', modalidad: 'Híbrida', estado: 'Convocada', quórum: null },
];

export const COMUNICADOS = [
  { id: 1, titulo: 'Corte de agua programado — Torre C', fecha: '2026-11-02', lecturas: 187, segmentacion: 'Torre C', estado: 'Publicado' },
  { id: 2, titulo: 'Recordatorio: pago cuota extraordinaria', fecha: '2026-10-30', lecturas: 224, segmentacion: 'Todas las unidades', estado: 'Publicado' },
  { id: 3, titulo: 'Simulacro de evacuación — 25 Nov', fecha: '2026-10-28', lecturas: 203, segmentacion: 'Todas las unidades', estado: 'Publicado' },
];

export const TASKS = {
  'Por hacer': [
    { id: 'T-311', titulo: 'Cotizar impermeabilización fachada Torre B', responsable: 'Jaime Arias', vence: '2026-11-07', prioridad: 'Alta' },
    { id: 'T-312', titulo: 'Actualizar póliza de administración', responsable: 'Laura Gómez', vence: '2026-11-06', prioridad: 'Normal' },
  ],
  'En progreso': [
    { id: 'T-305', titulo: 'Convocatoria asamblea ordinaria 2027', responsable: 'Laura Gómez', vence: '2026-11-14', prioridad: 'Normal' },
    { id: 'T-307', titulo: 'Revisión legal reformas reglamento', responsable: 'Consejo', vence: '2026-11-20', prioridad: 'Alta' },
  ],
  'En revisión': [
    { id: 'T-298', titulo: 'Acta de consejo — octubre', responsable: 'Marcela Torres', vence: '2026-11-04', prioridad: 'Normal' },
  ],
  'Completadas': [
    { id: 'T-290', titulo: 'Renovación RETI piscina', responsable: 'Néstor Beltrán', vence: '2026-10-28', prioridad: 'Normal' },
  ],
};

export const NOTIFICACIONES = [
  { id: 1, titulo: '17 PQRS pendientes de respuesta', detalle: '5 vencen hoy · 2 con prioridad urgente', tiempo: 'Hace 12 min', tipo: 'warn' as const },
  { id: 2, titulo: 'Pago recibido — Apto 502-B', detalle: 'PSE $ 760.000 aplicado a Nov-2026', tiempo: 'Hace 1 h', tipo: 'ok' as const },
  { id: 3, titulo: 'OT-2026-0141 cerrada', detalle: 'Ascensor Torre C operativo', tiempo: 'Ayer 18:30', tipo: 'ok' as const },
  { id: 4, titulo: 'Conciliación con 4 diferencias', detalle: 'Octubre: $ 3.2 M sin identificar', tiempo: 'Ayer 11:20', tipo: 'info' as const },
];

export const ORGANIZACIONES_SAAS = [
  { id: 'ORG-001', nombre: 'Administradora Vivir S.A.S', nit: '900.112.334-5', copropiedades: 6, plan: 'Empresarial', estado: 'Activa', mrr: 4_800_000, desde: '2023-02-14' },
  { id: 'ORG-002', nombre: 'Gestión PH del Norte', nit: '830.556.221-8', copropiedades: 3, plan: 'Profesional', estado: 'Activa', mrr: 1_350_000, desde: '2024-06-01' },
  { id: 'ORG-003', nombre: 'Copropiedades El Poblado', nit: '811.008.992-3', copropiedades: 2, plan: 'Esencial', estado: 'Suspendida', mrr: 0, desde: '2022-11-20' },
  { id: 'ORG-004', nombre: 'Administradora Andina', nit: '901.445.778-0', copropiedades: 11, plan: 'Empresarial', estado: 'Activa', mrr: 8_250_000, desde: '2021-08-09' },
];

export const SOPORTE_TICKETS = [
  { id: 'SUP-1042', org: 'Gestión PH del Norte', asunto: 'Error al generar cuentas de cobro PDF', prioridad: 'Alta', estado: 'Abierto', fecha: '2026-11-02' },
  { id: 'SUP-1041', org: 'Administradora Vivir', asunto: 'Solicitud de migración de 1.200 unidades', prioridad: 'Normal', estado: 'En progreso', fecha: '2026-10-31' },
  { id: 'SUP-1040', org: 'Copropiedades El Poblado', asunto: 'Reactivación de servicio — pago pendiente', prioridad: 'Urgente', estado: 'Abierto', fecha: '2026-10-30' },
];

/* ============ Finanzas Urbania (alineación con el proyecto real, 2026-11) ============ */

/* tbl_periodos_facturacion — ciclos de facturación por mes/año */
export const PERIODOS_FACTURACION = [
  { id: 'PF-2026-11', nombre: 'Noviembre 2026', anio: 2026, mes: 11, vence: '2026-11-15', estado: 'Abierto', facturado: 182_400_000, recaudado: 128_600_000, mora: 9_840_000 },
  { id: 'PF-2026-10', nombre: 'Octubre 2026', anio: 2026, mes: 10, vence: '2026-10-15', estado: 'Cerrado', facturado: 178_900_000, recaudado: 171_250_000, mora: 7_620_000 },
  { id: 'PF-2026-09', nombre: 'Septiembre 2026', anio: 2026, mes: 9, vence: '2026-09-15', estado: 'Cerrado', facturado: 176_300_000, recaudado: 169_480_000, mora: 8_150_000 },
];

/* tbl_mora — intereses de mora liquidados por cuota vencida (tasa 1.5% m.e.) */
export const MORA = [
  { id: 'MO-3311', unidad: '1201-C', cuota: 'ADM Dic-2025', capital: 2_700_000, tasa: 1.5, meses: 11, valor: 445_500, estado: 'Pendiente' },
  { id: 'MO-3310', unidad: '702-B', cuota: 'ADM Jul-2026', capital: 2_850_000, tasa: 1.5, meses: 4, valor: 171_000, estado: 'Pendiente' },
  { id: 'MO-3309', unidad: '1103-A', cuota: 'ADM Sep-2026', capital: 2_850_000, tasa: 1.5, meses: 2, valor: 85_500, estado: 'Pagado' },
  { id: 'MO-3308', unidad: 'LC-03', cuota: 'ADM Oct-2026', capital: 1_450_000, tasa: 1.5, meses: 1, valor: 21_750, estado: 'Pendiente' },
  { id: 'MO-3307', unidad: '804-A', cuota: 'ADM Ago-2026', capital: 950_000, tasa: 1.5, meses: 3, valor: 42_750, estado: 'Condonado' },
];

/* Cobro por etapas (persuasivo → prejurídico → jurídico) — tbl_cobro_etapas */
export const ETAPAS_COBRO = [
  { id: 'CE-011', unidad: '1201-C', titular: 'Ricardo Antonio Nieto', deuda: 5_700_000, etapa: 'prejuridico' as const, desde: '2026-09-10', abogado: 'Cárdenas & Asociados', estado: 'Abierta' },
  { id: 'CE-010', unidad: '702-B', titular: 'María C. Holguín', deuda: 2_850_000, etapa: 'persuasivo' as const, desde: '2026-10-05', abogado: '—', estado: 'Abierta' },
  { id: 'CE-009', unidad: 'LC-03', titular: 'Panadería La Espiga S.A.S', deuda: 3_250_000, etapa: 'juridico' as const, desde: '2026-06-01', abogado: 'Cárdenas & Asociados', estado: 'Abierta' },
  { id: 'CE-008', unidad: '804-A', titular: 'Sandra Lucía Contreras', deuda: 950_000, etapa: 'persuasivo' as const, desde: '2026-11-02', abogado: '—', estado: 'Abierta' },
];
export const ETAPAS_COBRO_COLS = [
  { id: 'persuasivo' as const, label: 'Persuasivo', detalle: 'Recordatorios, llamadas y acuerdos de pago' },
  { id: 'prejuridico' as const, label: 'Prejurídico', detalle: 'Comunicación formal de cartera vencida' },
  { id: 'juridico' as const, label: 'Jurídico', detalle: 'Demanda ejecutiva ante juzgados civiles' },
];

/* tbl_fondos — fondos contables Ley 675 (imprevistos art. 35, reserva para obras) */
export const FONDOS = [
  { id: 1, codigo: 'IMPREV', nombre: 'Fondo de imprevistos', cuenta: '3205-01', saldo: 42_750_000, aporteMes: 5_130_000, usoAno: 18_400_000, activo: true },
  { id: 2, codigo: 'RESERV', nombre: 'Fondo de reserva (obras mayores)', cuenta: '3205-02', saldo: 96_300_000, aporteMes: 8_000_000, usoAno: 0, activo: true },
  { id: 3, codigo: 'JURID', nombre: 'Fondo jurídico', cuenta: '3205-03', saldo: 6_500_000, aporteMes: 500_000, usoAno: 2_100_000, activo: true },
];

/* tbl_plan_cuentas — PUC (Decreto 2649/93), jerarquía por clase */
export const PUC_CLASES = [
  { clase: '1', nombre: 'Activos', color: 'blue' },
  { clase: '2', nombre: 'Pasivos', color: 'red' },
  { clase: '3', nombre: 'Patrimonio', color: 'violet' },
  { clase: '4', nombre: 'Ingresos', color: 'green' },
  { clase: '5', nombre: 'Gastos', color: 'amber' },
  { clase: '6', nombre: 'Costos', color: 'gray' },
];
export const PUC_CUENTAS = [
  { codigo: '1105', nombre: 'Caja', clase: '1', tipo: 'Activo', naturaleza: 'Débito', nivel: 2, cuenta_padre: '11', permite_conciliar: false, permite_asiento: true, requiere_tercero: false },
  { codigo: '1110', nombre: 'Cuentas corrientes', clase: '1', tipo: 'Activo', naturaleza: 'Débito', nivel: 2, cuenta_padre: '11', permite_conciliar: true, permite_asiento: true, requiere_tercero: false },
  { codigo: '1305', nombre: 'Cuentas por cobrar a socios', clase: '1', tipo: 'Activo', naturaleza: 'Débito', nivel: 2, cuenta_padre: '13', permite_conciliar: false, permite_asiento: true, requiere_tercero: true },
  { codigo: '1310', nombre: 'Cartera por administración', clase: '1', tipo: 'Activo', naturaleza: 'Débito', nivel: 2, cuenta_padre: '13', permite_conciliar: false, permite_asiento: true, requiere_tercero: true },
  { codigo: '2105', nombre: 'Obligaciones financieras', clase: '2', tipo: 'Pasivo', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '21', permite_conciliar: false, permite_asiento: true, requiere_tercero: false },
  { codigo: '2205', nombre: 'Cuentas por pagar comerciales', clase: '2', tipo: 'Pasivo', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '22', permite_conciliar: false, permite_asiento: true, requiere_tercero: true },
  { codigo: '2335', nombre: 'Costos y gastos por pagar — administración', clase: '2', tipo: 'Pasivo', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '23', permite_conciliar: false, permite_asiento: true, requiere_tercero: false },
  { codigo: '3205', nombre: 'Fondos de la copropiedad', clase: '3', tipo: 'Patrimonio', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '32', permite_conciliar: false, permite_asiento: true, requiere_tercero: false },
  { codigo: '3105', nombre: 'Capital copropiedad', clase: '3', tipo: 'Patrimonio', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '31', permite_conciliar: false, permite_asiento: true, requiere_tercero: false },
  { codigo: '4135', nombre: 'Ingresos por administración ordinaria', clase: '4', tipo: 'Ingreso', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '41', permite_conciliar: false, permite_asiento: true, requiere_tercero: false },
  { codigo: '4195', nombre: 'Intereses de mora', clase: '4', tipo: 'Ingreso', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '41', permite_conciliar: false, permite_asiento: true, requiere_tercero: true },
  { codigo: '4170', nombre: 'Sanciones por convivencia', clase: '4', tipo: 'Ingreso', naturaleza: 'Crédito', nivel: 2, cuenta_padre: '41', permite_conciliar: false, permite_asiento: true, requiere_tercero: true },
  { codigo: '5135', nombre: 'Servicios públicos zonas comunes', clase: '5', tipo: 'Gasto', naturaleza: 'Débito', nivel: 2, cuenta_padre: '51', permite_conciliar: false, permite_asiento: true, requiere_tercero: false },
  { codigo: '5140', nombre: 'Mantenimiento de ascensores', clase: '5', tipo: 'Gasto', naturaleza: 'Débito', nivel: 2, cuenta_padre: '51', permite_conciliar: false, permite_asiento: true, requiere_tercero: true },
  { codigo: '5195', nombre: 'Gastos legales y demandas', clase: '5', tipo: 'Gasto', naturaleza: 'Débito', nivel: 2, cuenta_padre: '51', permite_conciliar: false, permite_asiento: true, requiere_tercero: true },
];

/* tbl_diarios_contables — diarios por tipo de operación */
export const DIARIOS = [
  { id: 'DJ-001', codigo: 'EFECTIVO', nombre: 'Caja', tipo: 'Efectivo', secuencia: 12, activo: true },
  { id: 'DJ-002', codigo: 'BANCO', nombre: 'Bancos', tipo: 'Banco', secuencia: 31, activo: true },
  { id: 'DJ-003', codigo: 'CARTERA', nombre: 'Facturación de periodo', tipo: 'Cartera', secuencia: 47, activo: true },
  { id: 'DJ-004', codigo: 'PROV', nombre: 'Proveedores y servicios', tipo: 'Proveedores', secuencia: 9, activo: true },
  { id: 'DJ-005', codigo: 'NOMINA', nombre: 'Nómina', tipo: 'Nómina', secuencia: 4, activo: true },
  { id: 'DJ-006', codigo: 'AJUSTES', nombre: 'Ajustes y fondos', tipo: 'Ajustes', secuencia: 18, activo: true },
  { id: 'DJ-007', codigo: 'CIERRE', nombre: 'Cierre contable', tipo: 'Cierre', secuencia: 2, activo: true },
];

/* tbl_impuestos — tasas parametrizables con cuenta débito/crédito */
export const IMPUESTOS = [
  { id: 'IM-01', codigo: 'IVA-19', nombre: 'IVA 19%', tipo: 'IVA', tasa: 19, cuentaDebito: '2408-01', cuentaCredito: '2408-02', activo: true },
  { id: 'IM-02', codigo: 'RF-75', nombre: 'Retención en la fuente 11%', tipo: 'Retención fuente', tasa: 11, cuentaDebito: '2365-01', cuentaCredito: '2365-02', activo: true },
  { id: 'IM-03', codigo: 'RF-002', nombre: 'Retención IVA 15%', tipo: 'Retención IVA', tasa: 15, cuentaDebito: '2367-01', cuentaCredito: '2367-02', activo: true },
  { id: 'IM-04', codigo: 'ICA-09', nombre: 'ICA Bogotá 9.66‰', tipo: 'ICA', tasa: 0.966, cuentaDebito: '2368-01', cuentaCredito: '2368-02', activo: true },
];

/* tbl_cierres_contables — trazabilidad del cierre mensual/anual */
export const CIERRES = [
  { id: 'CZ-2026-10', tipo: 'Mensual', anio: 2026, mes: 'Octubre', fecha: '2026-10-31', resultado: 10_580_000, estado: 'Completado' },
  { id: 'CZ-2026-09', tipo: 'Mensual', anio: 2026, mes: 'Septiembre', fecha: '2026-09-30', resultado: 12_340_000, estado: 'Completado' },
  { id: 'CZ-2026-08', tipo: 'Mensual', anio: 2026, mes: 'Agosto', fecha: '2026-08-31', resultado: 8_910_000, estado: 'Completado' },
  { id: 'CZ-2025', tipo: 'Anual', anio: 2025, mes: 'Diciembre (anual)', fecha: '2025-12-31', resultado: 41_200_000, estado: 'Completado' },
];

/* tbl_activos_depreciaciones — depreciación por activo (línea recta) */
export const DEPRECIACIONES = [
  { id: 'DP-0088', activo: 'Ascensor Torre A (línea 1)', metodo: 'Línea recta', valorActivo: 180_000_000, depreciacionPeriodo: 2_250_000, acumulada: 40_500_000, valorNeto: 139_500_000, estado: 'Contabilizada' },
  { id: 'DP-0087', activo: 'Planta eléctrica 250 kVA', metodo: 'Línea recta', valorActivo: 95_000_000, depreciacionPeriodo: 1_583_333, acumulada: 25_333_333, valorNeto: 69_666_667, estado: 'Contabilizada' },
  { id: 'DP-0086', activo: 'Bomba hidroneumática', metodo: 'Reducción de saldos', valorActivo: 18_000_000, depreciacionPeriodo: 450_000, acumulada: 7_200_000, valorNeto: 10_800_000, estado: 'Pendiente' },
];

/* tbl_documentos_electronicos — documentos soporte/electrónicos DIAN */
export const DOCS_ELECTRONICOS = [
  { id: 'DE-2211', tipo: 'Cuenta de cobro', numero: 'CC-000124', fecha: '2026-11-02', cufe: 'a3f91c…7be2', estado: 'Validado', valor: 182_400_000 },
  { id: 'DE-2210', tipo: 'Documento equivalente', numero: 'DV-00982', fecha: '2026-11-02', cufe: 'bb41d2…91aa', estado: 'Validado', valor: 4_150_000 },
  { id: 'DE-2209', tipo: 'Nota crédito', numero: 'NC-000031', fecha: '2026-10-30', cufe: 'c90e77…3d10', estado: 'Rechazado', valor: 760_000 },
  { id: 'DE-2208', tipo: 'Cuenta de cobro', numero: 'CC-000123', fecha: '2026-10-02', cufe: 'd114fa…c55b', estado: 'Validado', valor: 178_900_000 },
  { id: 'DE-2207', tipo: 'Documento equivalente', numero: 'DV-00981', fecha: '2026-10-29', cufe: '—', estado: 'Pendiente', valor: 6_300_000 },
];
