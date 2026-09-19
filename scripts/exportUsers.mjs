// Genera el Excel de seguimiento de usuarios de Tratoo (clientes y profesionales).
// Uso: node scripts/exportUsers.mjs
// Lee solo (nunca escribe en la base). Si el Excel ya existe, conserva lo que se
// escribió a mano en las columnas de seguimiento, cruzando por email.
// El archivo tiene datos personales: se guarda fuera del repo (ver OUT_PATH).

import fs from 'node:fs'
import path from 'node:path'
import ExcelJS from 'exceljs'
import { createClient } from '@supabase/supabase-js'

const OUT_DIR = 'C:\\Users\\maria\\Desktop\\Tratoo - Usuarios'
const OUT_PATH = path.join(OUT_DIR, 'Tratoo - Base de usuarios.xlsx')
const PROMO_CAP = 100
const MAX_ROWS = 2000 // rango que cubren las fórmulas del Resumen
const FONT = 'Arial'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([^=#]+)=(.*)$/)
  if (m) env[m[1].trim()] = m[2].trim()
}
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function listAllAuthUsers() {
  const all = []
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    all.push(...data.users)
    if (data.users.length < 200) break
  }
  return all
}

async function must(query) {
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

const [authUsers, profiles, pros, contacts, categories, requests, plans] = await Promise.all([
  listAllAuthUsers(),
  must(admin.from('profiles').select('*')),
  must(admin.from('professional_profiles').select('*')),
  must(admin.from('professional_contacts').select('*')),
  must(admin.from('categories').select('id,name')),
  must(admin.from('service_requests').select('id,client_id,professional_id,category_id,status,created_at')),
  must(admin.from('subscription_plans').select('id,name')),
])

const byId = (rows, key = 'id') => new Map(rows.map((r) => [r[key], r]))
const profileById = byId(profiles)
const proById = byId(pros, 'user_id')
const contactById = byId(contacts, 'user_id')
const categoryById = byId(categories)
const planById = byId(plans)

const sentBy = new Map()
const receivedBy = new Map()
for (const r of requests) {
  sentBy.set(r.client_id, (sentBy.get(r.client_id) ?? 0) + 1)
  receivedBy.set(r.professional_id, (receivedBy.get(r.professional_id) ?? 0) + 1)
}

// Fecha en hora de Argentina (UTC-3), sin hora, para que Excel muestre el día correcto.
const day = (iso) => {
  if (!iso) return null
  const d = new Date(new Date(iso).getTime() - 3 * 3600 * 1000)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

const yesNo = (b) => (b ? 'Sí' : 'No')

// Cuentas que se ven de prueba por el email (las de familia hay que marcarlas a mano).
const TEST_EMAIL = /@example\.com$|^zolvi\.|smoketest|^qa\./

// Lo escrito a mano en una corrida anterior.
const MANUAL_KEYS = ['test', 'origen', 'contactadoPor', 'estado', 'notas']
const previous = new Map()
if (fs.existsSync(OUT_PATH)) {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(OUT_PATH)
  const ws = wb.getWorksheet('Usuarios')
  if (ws) {
    const header = ws.getRow(1).values
    const col = (title) => header.indexOf(title)
    const idx = {
      email: col('Email'),
      test: col('¿Cuenta de prueba?'),
      origen: col('Origen'),
      contactadoPor: col('Contactado por'),
      estado: col('Estado de seguimiento'),
      notas: col('Notas'),
    }
    ws.eachRow((row, n) => {
      if (n === 1) return
      const email = String(row.getCell(idx.email).value ?? '').toLowerCase()
      if (!email) return
      const saved = {}
      for (const k of MANUAL_KEYS) {
        const v = row.getCell(idx[k]).value
        saved[k] = v == null ? '' : String(v)
      }
      previous.set(email, saved)
    })
  }
}

const rows = authUsers
  .map((u) => {
    const p = profileById.get(u.id)
    const pro = proById.get(u.id)
    const email = (u.email ?? p?.email ?? '').toLowerCase()
    const phone = contactById.get(u.id)?.phone || p?.phone || ''
    const isPro = p?.role === 'professional' || p?.role === 'admin' || !!pro
    const category = pro?.category_id ? categoryById.get(pro.category_id)?.name : null
    const profession = category || pro?.custom_profession || ''
    const complete =
      !!pro?.business_name && !!(pro?.category_id || pro?.custom_profession) && !!pro?.province && !!contactById.get(u.id)?.phone
    const active = pro?.subscription_status === 'active'
    const onPromo = !!pro?.promo_pro_until && !pro?.mp_preapproval_id
    let plan = 'Gratuito'
    if (active) {
      plan = planById.get(pro.subscription_plan_id)?.name ?? 'Pro'
      if (onPromo) plan += ' (promo)'
    }
    const saved = previous.get(email) ?? {}
    return {
      alta: day(u.created_at),
      nombre: p?.full_name ?? '',
      email,
      telefono: phone,
      ciudad: pro?.city || p?.city || '',
      tipo: isPro ? 'Profesional' : 'Cliente',
      confirmado: yesNo(!!u.email_confirmed_at),
      ultimoIngreso: day(u.last_sign_in_at),
      test: saved.test || (TEST_EMAIL.test(email) ? 'Sí' : 'No'),
      profesion: profession,
      marca: pro?.business_name ?? '',
      provincia: pro?.province ?? '',
      completo: isPro ? yesNo(complete) : '',
      publicado: isPro ? yesNo(complete && !pro?.hidden) : '',
      verificado: isPro ? yesNo(!!pro?.verified) : '',
      plan: isPro ? plan : '',
      promoHasta: day(pro?.promo_pro_until),
      enviadas: sentBy.get(u.id) ?? 0,
      recibidas: isPro ? (receivedBy.get(u.id) ?? 0) : '',
      origen: saved.origen ?? '',
      contactadoPor: saved.contactadoPor ?? '',
      estado: saved.estado ?? '',
      notas: saved.notas ?? '',
    }
  })
  .sort((a, b) => (b.alta?.getTime() ?? 0) - (a.alta?.getTime() ?? 0))

const columns = [
  ['Fecha de alta', 'alta', 13, 'auto'],
  ['Nombre', 'nombre', 24, 'auto'],
  ['Email', 'email', 32, 'auto'],
  ['Teléfono', 'telefono', 16, 'auto'],
  ['Ciudad', 'ciudad', 16, 'auto'],
  ['Tipo', 'tipo', 13, 'auto'],
  ['Email confirmado', 'confirmado', 12, 'auto'],
  ['Último ingreso', 'ultimoIngreso', 13, 'auto'],
  ['¿Cuenta de prueba?', 'test', 13, 'manual'],
  ['Rubro / profesión', 'profesion', 22, 'auto'],
  ['Nombre o marca', 'marca', 22, 'auto'],
  ['Provincia', 'provincia', 13, 'auto'],
  ['Perfil completo', 'completo', 11, 'auto'],
  ['Perfil publicado', 'publicado', 11, 'auto'],
  ['Verificado', 'verificado', 11, 'auto'],
  ['Plan', 'plan', 16, 'auto'],
  ['Promo Pro hasta', 'promoHasta', 14, 'auto'],
  ['Solicitudes enviadas', 'enviadas', 12, 'auto'],
  ['Solicitudes recibidas', 'recibidas', 12, 'auto'],
  ['Origen', 'origen', 18, 'manual'],
  ['Contactado por', 'contactadoPor', 18, 'manual'],
  ['Estado de seguimiento', 'estado', 22, 'manual'],
  ['Notas', 'notas', 46, 'manual'],
]
const colLetter = (title) => {
  const i = columns.findIndex((c) => c[0] === title)
  return String.fromCharCode(65 + i)
}

const ORIGENES = ['Instagram (DM)', 'WhatsApp', 'Conocido', 'Post / Story', 'Boca a boca', 'Otro']
const ESTADOS = ['Nuevo', 'Contactado', 'Respondió', 'Perfil completo', 'Necesita ayuda', 'Sin respuesta', 'Descartado']

const wb = new ExcelJS.Workbook()
wb.creator = 'Tratoo'

const AUTO_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF09090B' } }
const MANUAL_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } }
const border = { style: 'thin', color: { argb: 'FFE4E4E7' } }

// ---------- Hoja Usuarios ----------
const ws = wb.addWorksheet('Usuarios', { views: [{ state: 'frozen', ySplit: 1, xSplit: 3 }] })
ws.columns = columns.map(([header, key, width]) => ({ header, key, width }))
ws.getRow(1).height = 32
ws.getRow(1).eachCell((cell, n) => {
  const kind = columns[n - 1][3]
  cell.fill = kind === 'manual' ? MANUAL_FILL : AUTO_FILL
  cell.font = { name: FONT, bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
})
for (const r of rows) ws.addRow(r)
const lastRow = Math.max(ws.rowCount, 2)
ws.eachRow((row, n) => {
  if (n === 1) return
  row.eachCell({ includeEmpty: true }, (cell, c) => {
    cell.font = { name: FONT, size: 10 }
    cell.alignment = { vertical: 'top', wrapText: columns[c - 1]?.[1] === 'notas' }
    cell.border = { bottom: border }
  })
})
for (const title of ['Fecha de alta', 'Último ingreso', 'Promo Pro hasta']) {
  ws.getColumn(columns.findIndex((c) => c[0] === title) + 1).numFmt = 'dd/mm/yyyy'
}
ws.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + columns.length)}1` }

const listValidation = (title, options) => {
  const letter = colLetter(title)
  for (let n = 2; n <= MAX_ROWS; n++) {
    ws.getCell(`${letter}${n}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`"${options.join(',')}"`],
    }
  }
}
listValidation('¿Cuenta de prueba?', ['Sí', 'No'])
listValidation('Origen', ORIGENES)
listValidation('Estado de seguimiento', ESTADOS)

// ---------- Hoja Solicitudes ----------
const wr = wb.addWorksheet('Solicitudes', { views: [{ state: 'frozen', ySplit: 1 }] })
wr.columns = [
  { header: 'Fecha', key: 'fecha', width: 13 },
  { header: 'Cliente', key: 'cliente', width: 28 },
  { header: 'Email del cliente', key: 'clienteEmail', width: 32 },
  { header: 'Profesional', key: 'profesional', width: 28 },
  { header: 'Rubro', key: 'rubro', width: 22 },
  { header: 'Estado', key: 'estado', width: 14 },
]
wr.getRow(1).eachCell((cell) => {
  cell.fill = AUTO_FILL
  cell.font = { name: FONT, bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
  cell.alignment = { vertical: 'middle', horizontal: 'center' }
})
const STATUS_ES = { pending: 'Pendiente', accepted: 'Aceptada', completed: 'Completada', cancelled: 'Cancelada' }
const authById = byId(authUsers)
for (const r of [...requests].sort((a, b) => b.created_at.localeCompare(a.created_at))) {
  const pro = proById.get(r.professional_id)
  wr.addRow({
    fecha: day(r.created_at),
    cliente: profileById.get(r.client_id)?.full_name ?? '',
    clienteEmail: authById.get(r.client_id)?.email ?? '',
    profesional: pro?.business_name || profileById.get(r.professional_id)?.full_name || '',
    rubro: (pro?.category_id ? categoryById.get(pro.category_id)?.name : null) || pro?.custom_profession || '',
    estado: STATUS_ES[r.status] ?? r.status,
  })
}
wr.getColumn(1).numFmt = 'dd/mm/yyyy'
wr.eachRow((row, n) => {
  if (n === 1) return
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { name: FONT, size: 10 }
    cell.border = { bottom: border }
  })
})
wr.autoFilter = { from: 'A1', to: 'F1' }

// ---------- Hoja Resumen (fórmulas sobre Usuarios) ----------
const wsum = wb.addWorksheet('Resumen', { properties: { tabColor: { argb: 'FF059669' } } })
wb.views = [{ activeTab: 0 }]
wsum.getColumn(1).width = 52
wsum.getColumn(2).width = 14
wsum.getColumn(3).width = 60

const R = (title) => `Usuarios!$${colLetter(title)}$2:$${colLetter(title)}$${MAX_ROWS}`
const TEST = R('¿Cuenta de prueba?')
const TIPO = R('Tipo')

// Valores en caché (para previsualizadores); Excel recalcula al abrir.
const real = rows.filter((r) => r.test !== 'Sí')
const cnt = (arr, f) => arr.filter(f).length
const today = new Date()
today.setUTCHours(0, 0, 0, 0)

const summary = [
  ['Cuentas reales (sin pruebas)', `COUNTIF(${TEST},"No")`, real.length, 'Excluye las marcadas como cuenta de prueba en la hoja Usuarios.'],
  ['  Clientes', `COUNTIFS(${TIPO},"Cliente",${TEST},"No")`, cnt(real, (r) => r.tipo === 'Cliente'), ''],
  ['  Profesionales', `COUNTIFS(${TIPO},"Profesional",${TEST},"No")`, cnt(real, (r) => r.tipo === 'Profesional'), ''],
  ['Con el email confirmado', `COUNTIFS(${R('Email confirmado')},"Sí",${TEST},"No")`, cnt(real, (r) => r.confirmado === 'Sí'), 'Sin confirmar el email no pueden entrar.'],
  ['Profesionales con perfil completo', `COUNTIFS(${R('Perfil completo')},"Sí",${TEST},"No")`, cnt(real, (r) => r.completo === 'Sí'), 'Tienen nombre, rubro, provincia y WhatsApp cargados.'],
  ['Profesionales con perfil publicado', `COUNTIFS(${R('Perfil publicado')},"Sí",${TEST},"No")`, cnt(real, (r) => r.publicado === 'Sí'), 'Los que hoy aparecen en el directorio.'],
  ['Profesionales registrados sin completar el perfil', `COUNTIFS(${R('Perfil completo')},"No",${TEST},"No")`, cnt(real, (r) => r.completo === 'No'), 'Son los que hay que ayudar o recordarles.'],
  ['Profesionales con promo Pro vigente', `COUNTIFS(${R('Promo Pro hasta')},">"&TODAY(),${TEST},"No")`, cnt(real, (r) => r.promoHasta && r.promoHasta > today), ''],
  ['Cupo de la promo usado (incluye pruebas)', `COUNT(${R('Promo Pro hasta')})`, cnt(rows, (r) => r.promoHasta), `Así lo cuenta la app: el cupo total es ${PROMO_CAP}.`],
  ['Cupo de la promo que queda', `${PROMO_CAP}-B10`, PROMO_CAP - cnt(rows, (r) => r.promoHasta), ''],
  ['Solicitudes enviadas en total', `SUM(${R('Solicitudes enviadas')})`, rows.reduce((s, r) => s + (r.enviadas || 0), 0), 'Detalle en la hoja Solicitudes.'],
]
wsum.addRow(['Tratoo — Base de usuarios']).font = { name: FONT, bold: true, size: 14 }
wsum.addRow([`Actualizado: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}`]).font = {
  name: FONT, italic: true, size: 9, color: { argb: 'FF71717A' },
}
wsum.addRow([])
const h = wsum.addRow(['Indicador', 'Cantidad', 'Detalle'])
h.eachCell((c) => {
  c.fill = AUTO_FILL
  c.font = { name: FONT, bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
})
summary.forEach(([label, formula, result, note], i) => {
  const row = wsum.addRow([label, { formula, result }, note])
  row.eachCell((c) => (c.font = { name: FONT, size: 10 }))
  row.getCell(2).alignment = { horizontal: 'center' }
  row.getCell(2).font = { name: FONT, size: 10, bold: true }
  row.getCell(3).font = { name: FONT, size: 9, color: { argb: 'FF71717A' } }
  row.eachCell((c) => (c.border = { bottom: border }))
  if (i === 9) row.getCell(2).value = { formula: `${PROMO_CAP}-B${row.number - 1}`, result }
})

wsum.addRow([])
const st = wsum.addRow(['Seguimiento por estado (sin pruebas)', 'Cantidad'])
st.eachCell((c) => {
  c.fill = MANUAL_FILL
  c.font = { name: FONT, bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
})
for (const estado of ESTADOS) {
  const row = wsum.addRow([
    estado,
    { formula: `COUNTIFS(${R('Estado de seguimiento')},"${estado}",${TEST},"No")`, result: cnt(real, (r) => r.estado === estado) },
  ])
  row.eachCell((c) => (c.font = { name: FONT, size: 10 }))
  row.getCell(2).alignment = { horizontal: 'center' }
  row.eachCell((c) => (c.border = { bottom: border }))
}

wsum.addRow([])
const lg = wsum.addRow(['Cómo se usa'])
lg.font = { name: FONT, bold: true, size: 11 }
const legend = [
  'Encabezado NEGRO = dato automático que viene de Tratoo: no lo edites, se pisa al actualizar.',
  'Encabezado VERDE = lo completás vos a mano; se conserva cuando se actualiza el archivo (se cruza por email).',
  '  · ¿Cuenta de prueba?: marcá "Sí" en las de prueba o de familia; así no cuentan en el Resumen.',
  '  · Origen: cómo llegó (ej: "Instagram (DM)"). Contactado por: quién le escribió (ej: "Marian").',
  '  · Estado de seguimiento: elegí de la lista. Notas: texto libre (ej: "Dijo que se registra el viernes").',
  'Para actualizar con las cuentas nuevas: pedirle a Claude "actualizá el Excel de usuarios" (con el archivo cerrado).',
  'Este archivo tiene datos personales de usuarios: no lo compartas ni lo subas a lugares públicos.',
]
for (const t of legend) {
  const row = wsum.addRow([t])
  row.getCell(1).font = { name: FONT, size: 10 }
}

fs.mkdirSync(OUT_DIR, { recursive: true })
await wb.xlsx.writeFile(OUT_PATH)
console.log(`Listo: ${rows.length} cuentas (${real.length} reales), ${requests.length} solicitudes -> ${OUT_PATH}`)
console.log(`Conservados de la corrida anterior: ${previous.size} usuarios`)
