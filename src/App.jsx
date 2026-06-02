import { useState, useEffect, useCallback } from "react";

// ── Design system styles ──────────────────────────────────────────
function InjectStyles() {
  useEffect(() => {
    const id = "kavak-design-system";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
      :root {
        --kavak-blue: #0066FF;
        --kavak-blue-deep: #0050CC;
        --kavak-blue-ink: #003FA3;
        --kavak-blue-hint: #E6F0FF;
        --kavak-blue-edge: #B8D2FF;
        --ink: #0A0B14; --ink-2: #1B1D2A; --ink-3: #3A3D4D;
        --muted: #6B6F80; --muted-2: #9B9EAB;
        --line: #E8E9EE; --line-2: #F1F2F6;
        --bg: #FAFAFB; --paper: #FFFFFF;
        --r-xs:8px; --r-sm:12px; --r-md:16px; --r-lg:22px; --r-xl:28px;
        --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
        --font-mono: ui-monospace, "SF Mono", monospace;
      }
      .kds-topbar { height:64px; padding:0 40px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--line); background:var(--paper); position:sticky; top:0; z-index:20; }
      .kds-brandmark { font-family:var(--font-display); font-weight:800; font-size:20px; letter-spacing:-0.04em; color:var(--ink); text-decoration:none; }
      .kds-brand-pill { display:inline-flex; align-items:center; gap:8px; padding:5px 10px; border:1px solid var(--line); border-radius:999px; font-size:12px; color:var(--muted); }
      .kds-brand-pill::before { content:""; width:6px; height:6px; border-radius:999px; background:var(--kavak-blue); display:inline-block; }
      .kds-hero { flex:1; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.05fr); min-height:calc(100vh - 64px); }
      .kds-hero__copy { padding:56px 56px 48px 64px; display:flex; flex-direction:column; justify-content:space-between; gap:40px; }
      .kds-eyebrow { font-size:11px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:var(--kavak-blue); display:inline-flex; align-items:center; gap:10px; }
      .kds-eyebrow::before { content:""; width:22px; height:1px; background:var(--kavak-blue); display:inline-block; }
      .kds-headline { font-family:var(--font-display); font-weight:600; font-size:clamp(52px,5.5vw,96px); line-height:0.94; letter-spacing:-0.045em; color:var(--ink); margin:16px 0 0; }
      .kds-headline .dot { color:var(--kavak-blue); }
      .kds-subhead { margin-top:20px; font-size:17px; line-height:1.5; color:var(--ink-3); max-width:440px; }
      .kds-choices { display:grid; grid-template-columns:1.4fr 1fr; gap:14px; margin-top:auto; }
      .kds-choice { position:relative; padding:24px 24px 20px; border-radius:var(--r-lg); background:var(--paper); border:1px solid var(--line); display:flex; flex-direction:column; gap:16px; text-align:left; cursor:pointer; transition:transform .25s cubic-bezier(.2,.7,.2,1), border-color .2s, box-shadow .25s; color:inherit; overflow:hidden; }
      .kds-choice:hover { transform:translateY(-2px); border-color:var(--ink); box-shadow:0 24px 40px -28px rgba(10,11,20,.2); }
      .kds-choice--primary { background:var(--kavak-blue); border-color:var(--kavak-blue); color:#fff; }
      .kds-choice--primary:hover { background:var(--kavak-blue-deep); border-color:var(--kavak-blue-deep); }
      .kds-choice__row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
      .kds-choice__tag { font-size:11px; letter-spacing:0.16em; text-transform:uppercase; font-weight:600; color:var(--muted); }
      .kds-choice--primary .kds-choice__tag { color:rgba(255,255,255,.7); }
      .kds-choice__icon { width:34px; height:34px; display:grid; place-items:center; border-radius:10px; background:var(--line-2); flex-shrink:0; }
      .kds-choice--primary .kds-choice__icon { background:rgba(255,255,255,.16); color:#fff; }
      .kds-choice__title { font-family:var(--font-display); font-size:24px; line-height:1.05; letter-spacing:-0.025em; font-weight:600; margin:0; }
      .kds-choice--secondary .kds-choice__title { font-size:20px; }
      .kds-choice__desc { font-size:13px; line-height:1.5; color:var(--muted); }
      .kds-choice--primary .kds-choice__desc { color:rgba(255,255,255,.78); }
      .kds-choice__cta { display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:500; color:var(--kavak-blue); }
      .kds-choice--primary .kds-choice__cta { color:#fff; }
      .kds-choice__meta { display:flex; align-items:center; gap:12px; font-size:12px; color:rgba(255,255,255,.78); border-top:1px solid rgba(255,255,255,.18); padding-top:12px; margin-top:2px; }
      .kds-dot { width:6px; height:6px; border-radius:999px; background:#6EE7A8; box-shadow:0 0 0 3px rgba(110,231,168,.25); display:inline-block; }
      .kds-hero__media { position:relative; overflow:hidden; background:#0a0b14; }
      .kds-hero__img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; }
      .kds-hero__veil { position:absolute; inset:0; background:linear-gradient(180deg,rgba(10,11,20,0) 50%,rgba(10,11,20,.55) 100%),linear-gradient(90deg,rgba(10,11,20,.2) 0%,rgba(10,11,20,0) 30%); }
      .kds-media-caption { position:absolute; bottom:0; left:0; right:0; padding:28px; display:flex; justify-content:space-between; align-items:flex-end; }
      .kds-media-caption__title { color:#fff; font-family:var(--font-display); font-size:22px; font-weight:600; margin:0 0 4px; letter-spacing:-0.02em; }
      .kds-media-caption__sub { color:rgba(255,255,255,.55); font-size:13px; margin:0; }
      .kds-ticker { position:absolute; top:24px; left:0; right:0; display:flex; justify-content:space-between; padding:0 28px; }
      .kds-ticker span { font-size:12px; color:rgba(255,255,255,.6); letter-spacing:0.06em; text-transform:uppercase; display:flex; align-items:center; gap:8px; }
      .kds-trust { border-top:1px solid var(--line); padding:20px 64px; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--muted); }
      .kds-trust__group { display:flex; align-items:center; gap:28px; }
      .kds-subscreen { flex:1; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); min-height:calc(100vh - 64px); }
      .kds-subscreen__panel { padding:56px 64px; display:flex; flex-direction:column; gap:36px; max-width:580px; }
      .kds-back-btn { display:inline-flex; align-items:center; gap:8px; font-size:14px; color:var(--muted); background:transparent; border:0; cursor:pointer; padding:0; }
      .kds-back-btn:hover { color:var(--ink); }
      .kds-subscreen__title { font-family:var(--font-display); font-weight:600; font-size:clamp(36px,3.8vw,60px); line-height:1; letter-spacing:-0.04em; margin:0; }
      .kds-subscreen__sub { font-size:16px; line-height:1.5; color:var(--ink-3); max-width:460px; margin:0; }
      .kds-field { display:flex; flex-direction:column; gap:8px; }
      .kds-field__label { font-size:13px; font-weight:500; color:var(--ink-3); display:flex; justify-content:space-between; align-items:baseline; }
      .kds-field__label small { color:var(--muted-2); font-weight:400; }
      .kds-input-wrap { position:relative; display:flex; align-items:center; border:1px solid var(--line); background:var(--paper); border-radius:var(--r-md); transition:border-color .2s,box-shadow .2s; overflow:hidden; }
      .kds-input-wrap:focus-within { border-color:var(--kavak-blue); box-shadow:0 0 0 4px color-mix(in oklab,var(--kavak-blue) 14%,transparent); }
      .kds-input-wrap.is-error { border-color:#E5484D; box-shadow:0 0 0 4px rgba(229,72,77,.12); }
      .kds-input-wrap__icon { display:grid; place-items:center; padding-left:16px; color:var(--muted); }
      .kds-input { flex:1; border:0; outline:0; background:transparent; padding:18px 16px; font-size:17px; color:var(--ink); letter-spacing:-0.005em; }
      .kds-input--mono { font-family:var(--font-mono); letter-spacing:0.04em; }
      .kds-input::placeholder { color:var(--muted-2); }
      .kds-btn { appearance:none; border:0; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:14px 22px; border-radius:var(--r-md); font-size:15px; font-weight:500; transition:transform .15s,background .2s; }
      .kds-btn:active { transform:translateY(1px); }
      .kds-btn--primary { background:var(--kavak-blue); color:#fff; }
      .kds-btn--primary:hover { background:var(--kavak-blue-deep); }
      .kds-btn--primary:disabled { background:var(--line); color:var(--muted-2); cursor:not-allowed; }
      .kds-btn--ghost { background:transparent; color:var(--ink-3); border:1px solid var(--line); }
      .kds-btn--ghost:hover { border-color:var(--ink); color:var(--ink); }
      .kds-btn--block { width:100%; }
      .kds-form-row { display:flex; align-items:center; gap:12px; }
      .kds-helper { display:flex; gap:12px; align-items:flex-start; padding:14px 16px; background:var(--kavak-blue-hint); border:1px solid var(--kavak-blue-edge); border-radius:var(--r-md); font-size:13px; line-height:1.5; color:var(--kavak-blue-ink); }
      .kds-helper__icon { flex-shrink:0; margin-top:1px; color:var(--kavak-blue); }
      .kds-status-strip { display:flex; align-items:center; gap:16px; padding-top:16px; font-size:13px; color:var(--muted); border-top:1px solid var(--line); }
      .kds-shake { animation:kds-shake .35s; }
      @keyframes kds-shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
      .kds-fade-in { animation:kds-fadeIn .4s cubic-bezier(.2,.7,.2,1) both; }
      @keyframes kds-fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      @media(max-width:1100px){
        .kds-hero{grid-template-columns:1fr} .kds-hero__media{min-height:320px}
        .kds-hero__copy{padding:40px 24px} .kds-subscreen{grid-template-columns:1fr}
        .kds-subscreen__panel{padding:40px 24px;max-width:100%}
        .kds-topbar{padding:0 24px} .kds-trust{padding:16px 24px} .kds-choices{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
}

// ── Icons ─────────────────────────────────────────────────────────
const ArrowRight = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
const ArrowLeft  = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>);
const IconUser   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>);
const IconWrench = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-2.1 2.6-2.4z"/></svg>);
const IconSearch = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>);
const IconLock   = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>);
const IconMail   = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>);
const IconInfo   = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v5"/></svg>);
const IconShield = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.6 8.4-8 9-4.4-.6-8-4-8-9V6l8-3z"/></svg>);
const IconEye    = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconEyeOff = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2M9.9 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7c1.6 0 3-.3 4.3-.8"/></svg>);
const IconPhone  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const IconCheck  = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>);

// ── Constants ─────────────────────────────────────────────────────
const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const PANEL_PASSWORD   = import.meta.env.VITE_PANEL_PASSWORD || "";

const ESTADO_MAP = {
  "PENDIENTE":                { principal: "Diagnostico", subestado: "Pendiente de diagnóstico", orden: 0 },
  "PENDIENTE DE DIAGNÓSTICO": { principal: "Diagnostico", subestado: "Pendiente de diagnóstico", orden: 0 },
  "DIAGNÓSTICO":              { principal: "Diagnostico", subestado: "En diagnóstico",            orden: 1 },
  "ESPERA DE REPUESTO":       { principal: "EnTrabajo",   subestado: "Espera de repuesto",        orden: 2 },
  "DISPONIBLE PARA TRABAJO":  { principal: "EnTrabajo",   subestado: "Disponible para trabajo",   orden: 3 },
  "TRABAJANDO":               { principal: "EnTrabajo",   subestado: "Trabajando",                orden: 4 },
  "PRUEBA DE RUTA":           { principal: "EnTrabajo",   subestado: "Prueba de ruta",            orden: 5 },
  "LISTO":                    { principal: "Listo",       subestado: "Listo para entregar",       orden: 6 },
  "ENTREGADO A CLIENTE":      { principal: "Listo",       subestado: "Entregado a cliente",       orden: 7 },
};

const SUBESTADOS_ORDEN = [
  { key: "PENDIENTE DE DIAGNÓSTICO", label: "Pendiente de diagnóstico", principal: "Diagnostico" },
  { key: "DIAGNÓSTICO",              label: "En diagnóstico",           principal: "Diagnostico" },
  { key: "ESPERA DE REPUESTO",       label: "Espera de repuesto",       principal: "EnTrabajo"   },
  { key: "DISPONIBLE PARA TRABAJO",  label: "Disponible para trabajo",  principal: "EnTrabajo"   },
  { key: "TRABAJANDO",               label: "Trabajando",               principal: "EnTrabajo"   },
  { key: "PRUEBA DE RUTA",           label: "Prueba de ruta",           principal: "EnTrabajo"   },
  { key: "LISTO",                    label: "Listo para entregar",      principal: "Listo"       },
  { key: "ENTREGADO A CLIENTE",      label: "Entregado a cliente",      principal: "Listo"       },
];

const ESTADOS = {
  Diagnostico: { label: "Diagnóstico", color: "#E24B4A", bg: "#FCEBEB", text: "#A32D2D", border: "#E24B4A30" },
  EnTrabajo:   { label: "En Trabajo",  color: "#EF9F27", bg: "#FAEEDA", text: "#633806", border: "#EF9F2730" },
  Listo:       { label: "Listo",       color: "#1D9E75", bg: "#E1F5EE", text: "#085041", border: "#1D9E7530" },
};

const KAVAK_BLUE       = "#0066FF";
const KAVAK_BLUE_DARK  = "#0052CC";
const KAVAK_BLUE_LIGHT = "#E5F0FF";

// ── Helpers ───────────────────────────────────────────────────────
function KavakLogo({ dark = false, small = false }) {
  return <span style={{ fontFamily: "'Arial Black','Arial Bold',Arial,sans-serif", fontWeight: 900, fontSize: small ? 14 : 20, letterSpacing: 1, color: dark ? "#0066FF" : "#ffffff", lineHeight: 1 }}>KAVAK</span>;
}
function getMapped(e) { const k = e?.toUpperCase().trim(); return ESTADO_MAP[k] || { principal: "Diagnostico", subestado: e, orden: -1 }; }
function getOrden(k)  { const e = ESTADO_MAP[k?.toUpperCase().trim()]; return e ? e.orden : -1; }
function formatFechaHora(fecha, hora) {
  if (!fecha) return null;
  const [y, m, d] = fecha.split("-");
  const h = hora ? hora.slice(0, 5) : null;
  return h ? `${d}-${m}-${y} ${h}` : `${d}-${m}-${y}`;
}
function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function haceHoras(fecha) { if (!fecha) return 999; return (Date.now() - new Date(fecha).getTime()) / 3600000; }
function formatUbicacion(u) {
  if (!u) return null;
  const up = u.toUpperCase().trim();
  if (up.includes("DEPOT")) return "Kavak Schiappacasse";
  if (up.includes("MBI"))   return "Kavak Mall Barrio Independencia";
  return u;
}
function normalizarSite(u) {
  if (!u) return null;
  const up = u.toUpperCase().trim();
  if (up.includes("DEPOT")) return "DEPOT";
  if (up.includes("MBI"))   return "MBI";
  return up;
}

// ── API Supabase ──────────────────────────────────────────────────
function supabaseFetch(path, options = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
  });
}
async function getCasos() { const r = await supabaseFetch("bbdd_cc_activos?order=fecha_ingreso.desc"); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function getComentarios() { const r = await supabaseFetch("comentarios?order=created_at.desc"); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function addComentario(data) { const r = await supabaseFetch("comentarios", { method: "POST", body: JSON.stringify(data) }); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function getComentariosByCaso(numero) { const r = await supabaseFetch(`comentarios?numero_caso=eq.${encodeURIComponent(numero)}&order=created_at.desc`); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function saveFeedback(data) { const r = await supabaseFetch("feedback_cliente", { method: "POST", body: JSON.stringify(data) }); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function registrarConsulta(busqueda, tipo, numero_caso, patente) {
  try { await supabaseFetch("consultas_cliente", { method: "POST", body: JSON.stringify({ busqueda, tipo, numero_caso: numero_caso || null, patente: patente || null, created_at: new Date().toISOString() }) }); }
  catch (e) { console.warn("No se pudo registrar consulta:", e.message); }
}
async function crearSolicitudContacto(data) { const r = await supabaseFetch("solicitudes_contacto", { method: "POST", body: JSON.stringify(data) }); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function getSolicitudesPendientes() { const r = await supabaseFetch("solicitudes_contacto?estado=eq.pendiente&order=created_at.asc"); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function marcarContactado(id, contactado_por) {
  const r = await supabaseFetch(`solicitudes_contacto?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ estado: "contactado", contactado_at: new Date().toISOString(), contactado_por }), prefer: "return=representation" });
  if (!r.ok) throw new Error(await r.text()); return r.json();
}

function filtrarProcesoReciente(todos) {
  if (!todos.length) return [];
  const maxId   = Math.max(...todos.map(f => f.id_sistema));
  const proceso = todos.filter(f => f.id_sistema === maxId);
  const validos = proceso.filter(f => f.fecha_ingreso || f.fecha_listo);
  const base    = validos.length > 0 ? validos : proceso;
  const ordenado = [...base].sort((a, b) => {
    if (!a.fecha_ingreso && !b.fecha_ingreso) return 0;
    if (!a.fecha_ingreso) return -1; if (!b.fecha_ingreso) return 1;
    return new Date(a.fecha_ingreso + "T" + (a.hora_ingreso || "00:00:00")) - new Date(b.fecha_ingreso + "T" + (b.hora_ingreso || "00:00:00"));
  });
  const ultimo = ordenado[ordenado.length - 1];
  return ordenado.filter(f => {
    if (f.estado_operativo?.toUpperCase().trim() === "ENTREGADO A CLIENTE" && !f.fecha_listo && f !== ultimo) return false;
    return true;
  });
}
async function getHistorialByNumero(numero) { const r = await supabaseFetch(`bbdd_cc?numero_caso=eq.${encodeURIComponent(numero)}&order=id_sistema.asc,fecha_ingreso.asc.nullslast,hora_ingreso.asc.nullslast`); if (!r.ok) throw new Error(await r.text()); return filtrarProcesoReciente(await r.json()); }
async function getHistorialByPatente(patente) { const r = await supabaseFetch(`bbdd_cc?patente=eq.${encodeURIComponent(patente.toUpperCase())}&order=id_sistema.asc,fecha_ingreso.asc.nullslast,hora_ingreso.asc.nullslast`); if (!r.ok) throw new Error(await r.text()); return filtrarProcesoReciente(await r.json()); }

// ── Slack (proxy via Vercel serverless function) ─────────────────
async function getCorreoByCaso(numero_caso) {
  try {
    const r = await supabaseFetch(`bbdd_cc?numero_caso=eq.${encodeURIComponent(numero_caso)}&correo=not.is.null&order=id_sistema.desc&limit=1`);
    if (!r.ok) return null;
    const data = await r.json();
    return data[0]?.correo?.trim() || null;
  } catch (e) { console.warn("No se pudo obtener correo:", e.message); return null; }
}
async function notificarSlack(solicitud) {
  const correo = await getCorreoByCaso(solicitud.numero_caso);
  try {
    await fetch("/api/notify-slack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...solicitud, correo }),
    });
  } catch (e) {
    console.warn("No se pudo notificar a Slack:", e.message);
  }
}

// ── UI base ───────────────────────────────────────────────────────
function Badge({ principal }) {
  const cfg = ESTADOS[principal]; if (!cfg) return null;
  return <span style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 500 }}>{cfg.label}</span>;
}
function SubBadge({ subestado, principal }) {
  const cfg = ESTADOS[principal] || {};
  return <span style={{ background: cfg.bg || "#f1efe8", color: cfg.text || "#444", border: `1px solid ${cfg.border || "#88888830"}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>{subestado}</span>;
}
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", minWidth: 420, maxWidth: 560, width: "90vw", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 22, color: "#aaa" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function TopBar({ onLogo }) {
  return (
    <header className="kds-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <a className="kds-brandmark" href="#" onClick={e => { e.preventDefault(); onLogo?.(); }}>KAVAK</a>
        <span className="kds-brand-pill">Portal · Sigue tu caso</span>
      </div>
    </header>
  );
}

// ── Pantalla inicio ───────────────────────────────────────────────
function PantallaInicio({ onCliente, onInterno }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-display)" }}>
      <InjectStyles /><TopBar />
      <div className="kds-hero kds-fade-in">
        <section className="kds-hero__copy">
          <div>
            <span className="kds-eyebrow">Portal de seguimiento</span>
            <h1 className="kds-headline">Sigue tu<br />caso<span className="dot">.</span></h1>
            <p className="kds-subhead">Consulta el estado de tu vehículo en tiempo real, o accede al panel interno de gestión post-venta.</p>
          </div>
          <div className="kds-choices">
            <button className="kds-choice kds-choice--primary" onClick={onCliente}>
              <div className="kds-choice__row"><span className="kds-choice__tag">Para clientes</span><span className="kds-choice__icon"><IconUser /></span></div>
              <div><h2 className="kds-choice__title">Soy cliente Kavak</h2><p className="kds-choice__desc">Consulta el estado de tu vehículo con tu número de caso o patente. Sin contraseña.</p></div>
              <span className="kds-choice__cta">Consultar mi caso <ArrowRight /></span>
              <div className="kds-choice__meta"><span className="kds-dot" /><span>Tiempo promedio de respuesta · 38 seg</span></div>
            </button>
            <button className="kds-choice kds-choice--secondary" onClick={onInterno}>
              <div className="kds-choice__row"><span className="kds-choice__tag">Equipo interno</span><span className="kds-choice__icon"><IconWrench /></span></div>
              <div><h2 className="kds-choice__title">Internos de Kavak</h2><p className="kds-choice__desc">Acceso al panel de gestión para el equipo de post-venta.</p></div>
              <span className="kds-choice__cta">Iniciar sesión <ArrowRight /></span>
            </button>
          </div>
        </section>
        <aside className="kds-hero__media">
          <img className="kds-hero__img" alt="" src="https://images.prd.kavak.io/assets/images/home-ui/cl-home-banner-md.webp" />
          <div className="kds-hero__veil" />
          <div className="kds-ticker"><span>Centro de servicio · Santiago</span><span><span className="kds-dot" style={{ marginRight: 6 }} />En operación</span></div>
          <div className="kds-media-caption"><div><p className="kds-media-caption__title">Cada caso, una historia.</p><p className="kds-media-caption__sub">Vehículos en proceso este mes</p></div></div>
        </aside>
      </div>
      <div className="kds-trust">
        <div className="kds-trust__group"><span><IconShield /> &nbsp;Datos cifrados extremo a extremo</span><span>+4 millones de clientes</span><span>Operación en 10 países</span></div>
        <span>© Kavak {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}

// ── Login internos ────────────────────────────────────────────────
function LoginInterno({ onLogin, onVolver }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false); const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false); const [shake, setShake] = useState(false);
  function handleLogin() {
    if (!email.trim()) { triggerShake("Ingresa tu correo"); return; }
    if (!email.trim().toLowerCase().endsWith("@kavak.com")) { triggerShake("Solo se permiten correos @kavak.com"); return; }
    if (password !== PANEL_PASSWORD) { triggerShake("Contraseña incorrecta"); return; }
    setSubmitting(true); setTimeout(() => onLogin(email.trim().toLowerCase()), 300);
  }
  function triggerShake(msg) { setErr(msg); setShake(true); setTimeout(() => setShake(false), 400); }
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-display)" }}>
      <InjectStyles /><TopBar onLogo={onVolver} />
      <div className="kds-subscreen kds-fade-in">
        <section className="kds-subscreen__panel">
          <button className="kds-back-btn" onClick={onVolver}><ArrowLeft /> Volver al inicio</button>
          <div>
            <span className="kds-eyebrow">Equipo interno</span>
            <h1 className="kds-subscreen__title" style={{ marginTop: 12 }}>Panel de<br />post-venta<span style={{ color: "var(--kavak-blue)" }}>.</span></h1>
            <p className="kds-subscreen__sub" style={{ marginTop: 16 }}>Accede al panel de gestión para revisar casos, asignar tareas y actualizar el estado de los vehículos en proceso.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="kds-field">
              <label className="kds-field__label"><span>Correo</span><small>@kavak.com</small></label>
              <div className={`kds-input-wrap${shake ? " is-error kds-shake" : ""}`}>
                <span className="kds-input-wrap__icon"><IconMail /></span>
                <input className="kds-input" type="email" placeholder="nombre@kavak.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="username" />
              </div>
            </div>
            <div className="kds-field">
              <label className="kds-field__label"><span>Contraseña</span></label>
              <div className={`kds-input-wrap${shake ? " is-error" : ""}`}>
                <span className="kds-input-wrap__icon"><IconLock /></span>
                <input className="kds-input" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ background: "transparent", border: 0, padding: "0 16px", color: "var(--muted)", cursor: "pointer", display: "grid", placeItems: "center", height: "100%" }}>{showPass ? <IconEyeOff /> : <IconEye />}</button>
              </div>
            </div>
            {err && <div className="kds-helper" style={{ background: "#FEECEC", borderColor: "#F8C9CA", color: "#9F1F23" }}><span className="kds-helper__icon" style={{ color: "#E5484D" }}><IconInfo /></span><div>{err}</div></div>}
            <button className="kds-btn kds-btn--primary kds-btn--block" onClick={handleLogin} disabled={submitting}>{submitting ? "Validando…" : <><span>Iniciar sesión</span><ArrowRight /></>}</button>
            <div className="kds-status-strip"><span className="kds-dot" /> Acceso limitado al equipo de post-venta · Auditado</div>
          </div>
        </section>
        <aside style={{ position: "relative", overflow: "hidden", backgroundImage: "url('https://elcomercio.pe/resizer/v2/CXTCJBTRVVHDNNNYKVW5AQDJGM.jpg?auth=02ab52d09ae8637b6d7de6cc064a0dd018ac69e5aba678c85f94ffcbc17d0f57&width=980&height=551&quality=75&smart=true')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,11,20,0.45)" }} />
        </aside>
      </div>
    </div>
  );
}

// ── Modal comentario ──────────────────────────────────────────────
function ModalComentario({ caso, onSave, onClose, defaultUser = "" }) {
  const [estadoComentario, setEstadoComentario] = useState(caso.estado_operativo?.toUpperCase().trim() || "DIAGNÓSTICO");
  const [comentario, setComentario] = useState(""); const [creadoPor, setCreadoPor] = useState(defaultUser);
  const [saving, setSaving] = useState(false); const [err, setErr] = useState("");
  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fafafa", color: "#1a1a1a", fontSize: 14, boxSizing: "border-box" };
  async function handleSave() {
    if (!comentario.trim()) { setErr("El comentario no puede estar vacío"); return; }
    setSaving(true); setErr("");
    try { await addComentario({ numero_caso: caso.numero_caso, patente: caso.patente, estado: estadoComentario, comentario: comentario.trim(), creado_por: creadoPor.trim() || "Sin nombre", created_at: new Date().toISOString() }); onSave(); onClose(); }
    catch (e) { setErr(e.message); } finally { setSaving(false); }
  }
  return (
    <div>
      <div style={{ background: "#f8f7f4", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Caso <strong>#{caso.numero_caso}</strong> · Patente <strong>{caso.patente}</strong></p>
        <div style={{ marginTop: 6 }}><SubBadge subestado={getMapped(estadoComentario).subestado} principal={getMapped(estadoComentario).principal} /></div>
      </div>
      <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Estado</label>
      <select style={{ ...inputStyle, marginBottom: 4 }} value={estadoComentario} onChange={e => setEstadoComentario(e.target.value)}>
        {Object.keys(ESTADO_MAP).filter(k => k !== "PENDIENTE").map(k => <option key={k} value={k}>{ESTADO_MAP[k].subestado}</option>)}
      </select>
      <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4, marginTop: 8 }}>Tu nombre</label>
      <input style={inputStyle} value={creadoPor} onChange={e => setCreadoPor(e.target.value)} placeholder="Ej: Juan Pérez" />
      <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4, marginTop: 12 }}>Comentario *</label>
      <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Describe el estado actual del vehículo..." />
      {err && <p style={{ color: "#c0392b", fontSize: 13, marginTop: 6 }}>{err}</p>}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{saving ? "Guardando..." : "Guardar comentario"}</button>
        <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #e0e0e0", background: "transparent", color: "#555", cursor: "pointer", fontSize: 14 }}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Modal historial ───────────────────────────────────────────────
function ModalHistorial({ caso, comentariosDeCaso, onClose }) {
  return (
    <div>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#666" }}>Caso <strong>#{caso.numero_caso}</strong> · Patente <strong>{caso.patente}</strong></p>
      {comentariosDeCaso.length === 0 ? <p style={{ color: "#aaa", textAlign: "center", padding: "24px 0" }}>Sin comentarios aún</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {comentariosDeCaso.map(c => {
            const { subestado, principal } = getMapped(c.estado); const cfg = ESTADOS[principal] || {};
            return (
              <div key={c.id} style={{ borderLeft: `3px solid ${c.es_general ? KAVAK_BLUE : (cfg.color || "#888")}`, background: c.es_general ? KAVAK_BLUE_LIGHT : "#f8f7f4", borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  {c.es_general ? <span style={{ background: KAVAK_BLUE_LIGHT, color: KAVAK_BLUE, border: `1px solid ${KAVAK_BLUE}30`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 500 }}>📝 Nota general</span> : <SubBadge subestado={subestado} principal={principal} />}
                  <span style={{ fontSize: 11, color: "#aaa" }}>{formatDate(c.created_at)}</span>
                </div>
                <p style={{ margin: "4px 0 2px", fontSize: 14 }}>{c.comentario}</p>
                {c.creado_por && <p style={{ margin: 0, fontSize: 12, color: "#999" }}>— {c.creado_por}</p>}
              </div>
            );
          })}
        </div>
      )}
      <button onClick={onClose} style={{ marginTop: 18, width: "100%", padding: "10px 0", borderRadius: 8, border: "1px solid #e0e0e0", background: "transparent", color: "#555", cursor: "pointer", fontSize: 14 }}>Cerrar</button>
    </div>
  );
}

// ── Modal Nota General ────────────────────────────────────────────
function ModalNotaGeneral({ caso, onSave, onClose, defaultUser = "" }) {
  const [nota, setNota] = useState(""); const [creadoPor, setCreadoPor] = useState(defaultUser);
  const [saving, setSaving] = useState(false); const [err, setErr] = useState("");
  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fafafa", color: "#1a1a1a", fontSize: 14, boxSizing: "border-box" };
  async function handleSave() {
    if (!nota.trim()) { setErr("La nota no puede estar vacía"); return; }
    setSaving(true); setErr("");
    try { await addComentario({ numero_caso: caso.numero_caso, patente: caso.patente, estado: null, comentario: nota.trim(), creado_por: creadoPor.trim() || "Sin nombre", es_general: true, created_at: new Date().toISOString() }); onSave(); onClose(); }
    catch (e) { setErr(e.message); } finally { setSaving(false); }
  }
  return (
    <div>
      <div style={{ background: "#f8f7f4", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Caso <strong>#{caso.numero_caso}</strong> · Patente <strong>{caso.patente}</strong></p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#aaa" }}>Esta nota es visible para el cliente en "Última actualización del equipo"</p>
      </div>
      <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Tu nombre</label>
      <input style={inputStyle} value={creadoPor} onChange={e => setCreadoPor(e.target.value)} placeholder="Ej: Juan Pérez" />
      <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4, marginTop: 12 }}>Nota general *</label>
      <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={nota} onChange={e => setNota(e.target.value)} placeholder="Ej: El cliente fue contactado, esperando confirmación de retiro..." />
      {err && <p style={{ color: "#c0392b", fontSize: 13, marginTop: 6 }}>{err}</p>}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{saving ? "Guardando..." : "Guardar nota"}</button>
        <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #e0e0e0", background: "transparent", color: "#555", cursor: "pointer", fontSize: 14 }}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Modal Necesito Contacto ───────────────────────────────────────
function ModalNecesitoContacto({ caso, onClose }) {
  const [mensaje, setMensaje] = useState(""); const [paso, setPaso] = useState(1);
  const [saving, setSaving] = useState(false); const [err, setErr] = useState("");
  async function handleEnviar() {
    setSaving(true); setErr("");
    try {
      const payload = { numero_caso: caso.numero_caso, patente: caso.patente, mensaje: mensaje.trim() || null, estado: "pendiente", created_at: new Date().toISOString() };
      await crearSolicitudContacto(payload);
      await notificarSlack(payload); // busca correo + Slack ID automáticamente
      setPaso(2);
    } catch (e) { setErr("No se pudo enviar. Intenta de nuevo."); } finally { setSaving(false); }
  }
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 420, width: "100%", boxShadow: "0 12px 48px rgba(0,0,0,0.18)", textAlign: "center" }}>
        {paso === 2 ? (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>✅</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>¡Solicitud enviada!</h2>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#888", lineHeight: 1.5 }}>El equipo de Kavak se pondrá en contacto contigo a la brevedad para resolver tus dudas.</p>
            <button onClick={onClose} style={{ padding: "11px 32px", borderRadius: 10, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Cerrar</button>
          </>
        ) : (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: KAVAK_BLUE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><IconPhone /></div>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Necesito contactarme</h2>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#888", lineHeight: 1.5 }}>Caso <strong>#{caso.numero_caso}</strong> · Patente <strong>{caso.patente}</strong><br />El equipo de post-venta se comunicará contigo a la brevedad.</p>
            <textarea style={{ width: "100%", minHeight: 90, padding: "10px 12px", borderRadius: 10, border: "1px solid #e0e0e0", background: "#fafafa", fontSize: 14, color: "#1a1a1a", resize: "vertical", boxSizing: "border-box", outline: "none", marginBottom: 6, textAlign: "left" }} placeholder="Opcional: cuéntanos brevemente tu consulta o duda..." value={mensaje} onChange={e => setMensaje(e.target.value)} />
            {err && <p style={{ color: "#c0392b", fontSize: 13, margin: "0 0 10px" }}>{err}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={handleEnviar} disabled={saving} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: saving ? "wait" : "pointer", fontSize: 14 }}>{saving ? "Enviando..." : "Enviar solicitud"}</button>
              <button onClick={onClose} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid #e0e0e0", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── CasoCard ──────────────────────────────────────────────────────
function CasoCard({ caso, comentariosDeCaso, onAgregarComentario, onNotaGeneral, onVerHistorial, alerta, colorBorde }) {
  const { principal, subestado } = getMapped(caso.estado_operativo);
  const cfg = ESTADOS[principal] || {};
  const ultimoComentario = comentariosDeCaso[0];
  const borderColor = colorBorde ? cfg.color : (alerta === "advertencia" ? "#E24B4A" : "#e0e0e0");
  const bgCard = colorBorde ? cfg.bg + "55" : "#fff";
  return (
    <div style={{ background: bgCard, border: `1px solid ${colorBorde ? cfg.border : alerta === "advertencia" ? "#E24B4A30" : "#ececec"}`, borderLeft: `4px solid ${borderColor}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{caso.patente}</span>
            <span style={{ fontSize: 13, color: "#ccc" }}>·</span>
            <span style={{ fontSize: 13, color: "#999" }}>Caso #{caso.numero_caso}</span>
            <Badge principal={principal} /><SubBadge subestado={subestado} principal={principal} />
            {alerta === "urgente"     && <span style={{ background: "#FAEEDA", color: "#633806", border: "1px solid #EF9F2740", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 500 }}>⏰ Actualizar comentario</span>}
            {alerta === "advertencia" && <span style={{ background: "#FCEBEB", color: "#A32D2D", border: "1px solid #E24B4A40", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 500 }}>⚠ Sin comentario +72h</span>}
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 6, flexWrap: "wrap" }}>
            {caso.fecha_ingreso && <span style={{ fontSize: 12, color: "#aaa" }}>📅 Ingreso: {formatFechaHora(caso.fecha_ingreso, caso.hora_ingreso)}</span>}
            {caso.fecha_listo   && <span style={{ fontSize: 12, color: "#aaa" }}>✅ Listo: {formatFechaHora(caso.fecha_listo, caso.hora_listo)}</span>}
            {caso.ubicacion     && <span style={{ fontSize: 12, color: "#aaa" }}>📍 {formatUbicacion(caso.ubicacion)}</span>}
          </div>
          {ultimoComentario ? <p style={{ margin: 0, fontSize: 13, color: "#666" }}>💬 {ultimoComentario.comentario}<span style={{ color: "#ccc", marginLeft: 6, fontSize: 11 }}>{formatDate(ultimoComentario.created_at)}</span></p>
            : <p style={{ margin: 0, fontSize: 13, color: "#ddd", fontStyle: "italic" }}>Sin comentarios</p>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <button onClick={() => onAgregarComentario(caso)} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: KAVAK_BLUE, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>+ Comentario</button>
          <button onClick={() => onNotaGeneral(caso)} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#f0f0f0", color: "#555", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>📝 Nota general</button>
          {comentariosDeCaso.length > 0 && <button onClick={() => onVerHistorial(caso)} style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #e0e0e0", background: "transparent", cursor: "pointer", fontSize: 12, color: "#777" }}>Historial ({comentariosDeCaso.length})</button>}
        </div>
      </div>
    </div>
  );
}

// ── Tab Backlog ───────────────────────────────────────────────────
function TabBacklog({ casos, comentariosMap, onAgregarComentario, onNotaGeneral, onVerHistorial, onRefresh }) {
  const [filtro, setFiltro] = useState("Todos"); const [filtroSite, setFiltroSite] = useState("Todos");
  const [busquedaCaso, setBusquedaCaso] = useState(""); const [busquedaPatente, setBusquedaPatente] = useState("");
  const backlog = casos.filter(c => {
    if (c.estado_operativo?.toUpperCase().trim() === "ENTREGADO A CLIENTE") return false;
    const { principal } = getMapped(c.estado_operativo);
    if (filtro !== "Todos" && principal !== filtro) return false;
    if (filtroSite !== "Todos" && normalizarSite(c.ubicacion) !== filtroSite) return false;
    if (busquedaCaso && !c.numero_caso?.toString().toLowerCase().includes(busquedaCaso.toLowerCase())) return false;
    if (busquedaPatente && !c.patente?.toLowerCase().includes(busquedaPatente.toLowerCase())) return false;
    return true;
  });
  const conteos = {}; casos.forEach(c => { if (c.estado_operativo?.toUpperCase().trim() === "ENTREGADO A CLIENTE") return; const { principal } = getMapped(c.estado_operativo); conteos[principal] = (conteos[principal] || 0) + 1; });
  const conteosSite = { DEPOT: 0, MBI: 0 };
  casos.forEach(c => { if (c.estado_operativo?.toUpperCase().trim() === "ENTREGADO A CLIENTE") return; const site = normalizarSite(c.ubicacion); if (site === "DEPOT") conteosSite.DEPOT++; else if (site === "MBI") conteosSite.MBI++; });
  const inputStyle = { padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fafafa", color: "#1a1a1a", fontSize: 13 };
  const SITES = [{ key: "Todos", label: "Todos los sites" }, { key: "DEPOT", label: "📍 Schiappacasse", count: conteosSite.DEPOT }, { key: "MBI", label: "📍 Mall B. Independencia", count: conteosSite.MBI }];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[{ label: "Total activos", value: casos.filter(c => c.estado_operativo?.toUpperCase().trim() !== "ENTREGADO A CLIENTE").length, color: KAVAK_BLUE, bg: KAVAK_BLUE_LIGHT }, { label: "Diagnóstico", value: conteos["Diagnostico"] || 0, color: ESTADOS.Diagnostico.color, bg: ESTADOS.Diagnostico.bg }, { label: "En Trabajo", value: conteos["EnTrabajo"] || 0, color: ESTADOS.EnTrabajo.color, bg: ESTADOS.EnTrabajo.bg }, { label: "Listos", value: conteos["Listo"] || 0, color: ESTADOS.Listo.color, bg: ESTADOS.Listo.bg }].map(m => (
          <div key={m.label} style={{ background: m.bg, borderRadius: 10, padding: "12px 16px", border: `1px solid ${m.color}25` }}>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: m.color, fontWeight: 500 }}>{m.label}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#aaa", fontWeight: 500, marginRight: 4 }}>Site:</span>
        {SITES.map(s => (
          <button key={s.key} onClick={() => setFiltroSite(s.key)} style={{ padding: "6px 14px", borderRadius: 20, border: filtroSite === s.key ? `1.5px solid ${KAVAK_BLUE}` : "1px solid #e0e0e0", background: filtroSite === s.key ? KAVAK_BLUE_LIGHT : "#fafafa", color: filtroSite === s.key ? KAVAK_BLUE : "#555", fontWeight: filtroSite === s.key ? 600 : 400, cursor: "pointer", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
            {s.label}{s.count !== undefined && <span style={{ background: filtroSite === s.key ? KAVAK_BLUE : "#e8e8e8", color: filtroSite === s.key ? "#fff" : "#777", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>{s.count}</span>}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#aaa" }}>{backlog.length} resultado{backlog.length !== 1 ? "s" : ""}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input style={{ ...inputStyle, width: 160 }} placeholder="Número de caso..." value={busquedaCaso} onChange={e => setBusquedaCaso(e.target.value)} />
          <input style={{ ...inputStyle, width: 130 }} placeholder="Patente..." value={busquedaPatente} onChange={e => setBusquedaPatente(e.target.value)} />
          <select style={inputStyle} value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="Todos">Todos los estados</option>
            {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={onRefresh} style={{ ...inputStyle, cursor: "pointer" }}>↻</button>
        </div>
      </div>
      {backlog.length === 0 ? <p style={{ color: "#ccc", textAlign: "center", marginTop: 40, fontSize: 14 }}>Sin casos para mostrar</p>
        : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{backlog.map(c => <CasoCard key={c.id_sistema} caso={c} comentariosDeCaso={comentariosMap[c.numero_caso] || []} onAgregarComentario={onAgregarComentario} onNotaGeneral={onNotaGeneral} onVerHistorial={onVerHistorial} alerta={null} colorBorde={true} />)}</div>}
    </div>
  );
}

// ── Tab Pendientes de Contacto ────────────────────────────────────
function TabPendientesContacto({ solicitudes, onMarcarContactado, onRefresh, loading }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Pendientes de contacto</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#888" }}>Clientes que solicitaron ser contactados — {solicitudes.length} pendiente{solicitudes.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={onRefresh} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e0e0e0", background: "transparent", cursor: "pointer", fontSize: 13, color: "#555" }}>↻ Actualizar</button>
      </div>
      {loading && <p style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: "24px 0" }}>Cargando...</p>}
      {!loading && solicitudes.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#ccc" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
          <p style={{ margin: 0, fontSize: 15 }}>No hay solicitudes pendientes</p>
          <p style={{ margin: "6px 0 0", fontSize: 13 }}>Cuando un cliente presione "Necesito contactarme" aparecerá aquí</p>
        </div>
      )}
      {!loading && solicitudes.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {solicitudes.map(s => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderLeft: `4px solid ${KAVAK_BLUE}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{s.patente}</span>
                    <span style={{ fontSize: 13, color: "#ccc" }}>·</span>
                    <span style={{ fontSize: 13, color: "#999" }}>Caso #{s.numero_caso}</span>
                    <span style={{ background: KAVAK_BLUE_LIGHT, color: KAVAK_BLUE, border: `1px solid ${KAVAK_BLUE}30`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>📞 Solicitud de contacto</span>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#bbb" }}>🕐 {formatDate(s.created_at)}</p>
                  {s.mensaje
                    ? <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "8px 12px", marginTop: 6 }}><p style={{ margin: 0, fontSize: 13, color: "#444" }}>💬 {s.mensaje}</p></div>
                    : <p style={{ margin: "4px 0 0", fontSize: 13, color: "#ccc", fontStyle: "italic" }}>Sin mensaje adicional</p>}
                </div>
                <button onClick={() => onMarcarContactado(s)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: "#E1F5EE", color: "#085041", fontWeight: 600, cursor: "pointer", fontSize: 12, flexShrink: 0, whiteSpace: "nowrap" }}>
                  <IconCheck /> Marcar contactado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Progreso cliente ──────────────────────────────────────────────
function ProgresoCliente({ historico, comentarios = [] }) {
  const casoActual = historico[historico.length - 1];
  const ordenActual = getOrden(casoActual?.estado_operativo?.toUpperCase().trim());
  const nk = k => k === "PENDIENTE" ? "PENDIENTE DE DIAGNÓSTICO" : k;
  const filasPorEstado = {};
  for (const fila of historico) { const k = nk(fila.estado_operativo?.toUpperCase().trim()); if (!k) continue; if (!filasPorEstado[k]) filasPorEstado[k] = []; filasPorEstado[k].push(fila); }
  function getFechas(k) {
    const filas = filasPorEstado[k]; if (!filas || !filas.length) return { filaInicio: null, filaFin: null };
    const abiertas = filas.filter(f => !f.fecha_listo);
    if (abiertas.length > 0) return { filaInicio: abiertas[abiertas.length - 1], filaFin: null };
    const ultima = filas[filas.length - 1]; return { filaInicio: ultima, filaFin: ultima };
  }
  const comentMap = {};
  for (const c of comentarios) { const k = c.estado?.toUpperCase().trim(); if (k) { if (!comentMap[k]) comentMap[k] = []; comentMap[k].push(c); } }
  const grupos = [
    { key: "Diagnostico", label: "Diagnóstico", subestados: SUBESTADOS_ORDEN.filter(s => s.principal === "Diagnostico") },
    { key: "EnTrabajo",   label: "En Trabajo",  subestados: SUBESTADOS_ORDEN.filter(s => s.principal === "EnTrabajo")   },
    { key: "Listo",       label: "Listo",       subestados: SUBESTADOS_ORDEN.filter(s => s.principal === "Listo")       },
  ];
  const DC = { Diagnostico: "#E24B4A", EnTrabajo: "#EF9F27", Listo: "#1D9E75" };
  return (
    <div style={{ margin: "8px 0" }}>
      {grupos.map((grupo, gi) => {
        const cfg = ESTADOS[grupo.key]; const dotColor = DC[grupo.key];
        const grupoActivo   = grupo.subestados.some(s => getOrden(s.key) <= ordenActual);
        const grupoCompleto = grupo.subestados.every(s => getOrden(s.key) < ordenActual);
        return (
          <div key={grupo.key} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${grupoActivo ? cfg.border : "#f0f0f0"}` }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: grupoActivo ? cfg.color : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: grupoActivo ? "#fff" : "#ccc", flexShrink: 0 }}>{grupoCompleto ? "✓" : gi + 1}</div>
              <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: grupoActivo ? cfg.text : "#ccc" }}>{grupo.label}</span>
              {grupoCompleto && <span style={{ marginLeft: "auto", background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "1px 10px", fontSize: 11, fontWeight: 500 }}>Completado ✓</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {grupo.subestados.map((s, si) => {
                const ordenS = getOrden(s.key); const completado = ordenS < ordenActual; const activo = ordenS === ordenActual;
                const key = nk(s.key); const existeEnHist = !!filasPorEstado[key];
                const tieneAbierta = existeEnHist && filasPorEstado[key].some(f => !f.fecha_listo);
                const llegóAListo = ordenActual >= 6;
                const retroced = !llegóAListo && !completado && !activo && existeEnHist && !tieneAbierta;
                const tieneInfo = completado || activo || retroced;
                const { filaInicio, filaFin } = getFechas(key);
                const inicioStr = filaInicio ? formatFechaHora(filaInicio.fecha_ingreso, filaInicio.hora_ingreso) : null;
                const listoStr  = filaFin    ? formatFechaHora(filaFin.fecha_listo, filaFin.hora_listo) : null;
                const isLast    = si === grupo.subestados.length - 1;
                return (
                  <div key={s.key} style={{ display: "flex", gap: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", marginTop: 13, flexShrink: 0, background: completado ? dotColor : activo ? "#6EE7A8" : "#e8e8e8", border: activo ? "none" : completado ? "none" : "2px solid #d0d0d0", boxShadow: activo ? "0 0 0 4px rgba(110,231,168,.2)" : "none" }} />
                      {!isLast && <div style={{ width: 2, flex: 1, minHeight: 14, background: completado ? dotColor + "60" : "#e8e8e8", marginTop: 3 }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: isLast ? 4 : 12, paddingLeft: 10, paddingTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: activo ? 600 : completado ? 500 : 400, color: activo ? "#1a1a1a" : completado ? "#555" : "#bbb", flex: 1 }}>{s.label}</span>
                        {activo    && <span style={{ background: cfg.color, color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>Estado actual</span>}
                        {completado && <span style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 500 }}>Completado ✓</span>}
                        {retroced  && <span style={{ background: "#f5f5f5", color: "#999", border: "1px solid #e8e8e8", borderRadius: 20, padding: "2px 10px", fontSize: 11 }}>↩ Retrocedido</span>}
                      </div>
                      {tieneInfo && (inicioStr || listoStr) && (
                        <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                          {inicioStr && <span style={{ fontSize: 12, color: retroced ? "#ccc" : "#888", textDecoration: retroced ? "line-through" : "none" }}>{inicioStr}</span>}
                          {listoStr && inicioStr !== listoStr && <span style={{ fontSize: 12, color: retroced ? "#ccc" : "#aaa", textDecoration: retroced ? "line-through" : "none" }}>→ {listoStr}</span>}
                        </div>
                      )}
                      {tieneInfo && comentMap[s.key]?.length > 0 && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                          {comentMap[s.key].map(c => (
                            <div key={c.id} style={{ background: "#fafafa", border: `1px solid ${cfg.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: "0 8px 8px 0", padding: "8px 12px" }}>
                              <p style={{ margin: "0 0 3px", fontSize: 13, color: "#333" }}>💬 {c.comentario}</p>
                              <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{formatDate(c.created_at)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Modal Feedback ────────────────────────────────────────────────
function ModalFeedback({ caso, onClose }) {
  const [puntuacion, setPuntuacion] = useState(0); const [hover, setHover] = useState(0);
  const [sugerencia, setSugerencia] = useState(""); const [paso, setPaso] = useState(1);
  const [saving, setSaving] = useState(false); const [err, setErr] = useState("");
  async function handleEnviar() {
    if (puntuacion === 0) { setErr("Por favor selecciona una puntuación"); return; }
    setSaving(true); setErr("");
    try { await saveFeedback({ numero_caso: caso.numero_caso, patente: caso.patente, puntuacion, sugerencia: sugerencia.trim() || null }); setPaso(3); }
    catch (e) { setErr("No se pudo guardar. Intenta de nuevo."); } finally { setSaving(false); }
  }
  const estrellaLabels = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];
  const estrellasColor = puntuacion >= 4 ? "#1D9E75" : puntuacion === 3 ? "#EF9F27" : puntuacion > 0 ? "#E24B4A" : "#ccc";
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 420, width: "100%", boxShadow: "0 12px 48px rgba(0,0,0,0.18)", textAlign: "center" }}>
        {paso === 3 ? (<>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>¡Gracias por tu opinión!</h2>
          <p style={{ margin: "0 0 24px", fontSize: 14, color: "#888" }}>Tu feedback nos ayuda a mejorar la experiencia para todos los clientes Kavak.</p>
          <button onClick={onClose} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Cerrar</button>
        </>) : paso === 1 ? (<>
          <div style={{ background: KAVAK_BLUE, borderRadius: 14, padding: "8px 20px", display: "inline-block", marginBottom: 16 }}><KavakLogo dark={false} small /></div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>¿Cómo fue tu experiencia?</h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#888" }}>Califica del 1 al 5 qué tan útil te resultó esta herramienta de seguimiento</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10 }}>
            {[1,2,3,4,5].map(n => <button key={n} onClick={() => setPuntuacion(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 40, padding: "2px 4px", transform: (hover||puntuacion)>=n?"scale(1.15)":"scale(1)", transition: "transform 0.1s", filter: (hover||puntuacion)>=n?"none":"grayscale(1) opacity(0.3)" }}>⭐</button>)}
          </div>
          {(hover > 0 || puntuacion > 0) && <p style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 600, color: estrellasColor }}>{estrellaLabels[hover||puntuacion]}</p>}
          {err && <p style={{ color: "#c0392b", fontSize: 13, margin: "0 0 12px" }}>{err}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { if (puntuacion===0){setErr("Por favor selecciona una puntuación");return;} setPaso(2); }} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Continuar →</button>
            <button onClick={onClose} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid #e0e0e0", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Omitir</button>
          </div>
        </>) : (<>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{["","😞","😕","😐","😊","🤩"][puntuacion]}</div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>¿Tienes alguna sugerencia?</h2>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#888" }}>Cuéntanos cómo podríamos mejorar esta herramienta (opcional)</p>
          <textarea style={{ width: "100%", minHeight: 100, padding: "10px 12px", borderRadius: 10, border: "1px solid #e0e0e0", background: "#fafafa", fontSize: 14, color: "#1a1a1a", resize: "vertical", boxSizing: "border-box", outline: "none", marginBottom: 16 }} placeholder="Ej: Me gustaría recibir notificaciones cuando cambie el estado..." value={sugerencia} onChange={e => setSugerencia(e.target.value)} />
          {err && <p style={{ color: "#c0392b", fontSize: 13, margin: "0 0 12px" }}>{err}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleEnviar} disabled={saving} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: saving?"wait":"pointer", fontSize: 14 }}>{saving?"Enviando...":"Enviar feedback"}</button>
            <button onClick={() => setPaso(1)} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid #e0e0e0", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 13 }}>← Volver</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

// ── Portal Cliente ────────────────────────────────────────────────
function PortalCliente({ onVolver, modoInterno = false }) {
  const [busqueda, setBusqueda] = useState(""); const [caso, setCaso] = useState(null);
  const [historico, setHistorico] = useState([]); const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const [showFeedback, setShowFeedback] = useState(false); const [showContacto, setShowContacto] = useState(false);
  const [shake, setShake] = useState(false);

  async function buscar() {
    const q = busqueda.trim(); if (!q) return;
    setLoading(true); setErr(""); setCaso(null); setHistorico([]); setComentarios([]);
    try {
      let hist = [];
      if (/^\d+$/.test(q)) hist = await getHistorialByNumero(q);
      if (hist.length === 0) hist = await getHistorialByPatente(q);
      if (hist.length === 0) { setErr("No se encontró ningún caso con ese número o patente."); }
      else {
        const casoReciente = hist[hist.length - 1];
        setCaso(casoReciente); setHistorico(hist);
        const comms = await getComentariosByCaso(casoReciente.numero_caso);
        setComentarios(comms);
        if (!modoInterno) {
          const tipo = /^\d+$/.test(q) ? "numero_caso" : "patente";
          await registrarConsulta(q, tipo, casoReciente.numero_caso, casoReciente.patente);
          if (hist[hist.length-1]?.estado_operativo?.toUpperCase().trim() === "LISTO") setTimeout(() => setShowFeedback(true), 6000);
        }
      }
    } catch (e) { setErr("Error al buscar: " + e.message); } finally { setLoading(false); }
  }

  const mapped = caso ? getMapped(caso.estado_operativo) : null;
  const cfg    = mapped ? ESTADOS[mapped.principal] : null;
  const comentarioInicial = historico.find(h => h.comentario && h.comentario.trim() !== "")?.comentario || null;
  function triggerShake() { setShake(true); setTimeout(() => setShake(false), 400); }

  if (!modoInterno && !caso) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-display)" }}>
        <InjectStyles /><TopBar onLogo={onVolver} />
        <div className="kds-subscreen kds-fade-in">
          <section className="kds-subscreen__panel">
            <button className="kds-back-btn" onClick={onVolver}><ArrowLeft /> Volver al inicio</button>
            <div>
              <span className="kds-eyebrow">Cliente</span>
              <h1 className="kds-subscreen__title" style={{ marginTop: 12 }}>Consulta<br />tu caso<span style={{ color: "var(--kavak-blue)" }}>.</span></h1>
              <p className="kds-subscreen__sub" style={{ marginTop: 16 }}>Ingresa los datos de tu caso para ver el estado actualizado de tu vehículo y próximos pasos.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="kds-field">
                <label className="kds-field__label"><span>Número de caso o patente</span><small>Puedes ingresar cualquiera de los dos</small></label>
                <div className={`kds-input-wrap${shake?" is-error kds-shake":""}`}>
                  <span className="kds-input-wrap__icon"><IconSearch /></span>
                  <input className="kds-input kds-input--mono" placeholder="Ej: 727885 o LHHY81" value={busqueda} onChange={e => setBusqueda(e.target.value.toUpperCase())} onKeyDown={e => e.key==="Enter" && (busqueda.trim()?buscar():triggerShake())} autoComplete="off" spellCheck={false} />
                </div>
              </div>
              {err && <div className="kds-helper" style={{ background: "#FEECEC", borderColor: "#F8C9CA", color: "#9F1F23" }}><span className="kds-helper__icon" style={{ color: "#E5484D" }}><IconInfo /></span><div>{err}</div></div>}
              <div className="kds-form-row">
                <button className="kds-btn kds-btn--primary" disabled={loading||!busqueda.trim()} onClick={() => busqueda.trim()?buscar():triggerShake()}>
                  {loading?"Consultando…":<><span>Consultar estado</span><ArrowRight /></>}
                </button>
              </div>
              <div className="kds-helper"><span className="kds-helper__icon"><IconInfo /></span><div><strong>Tu información está protegida.</strong> No requerimos contraseña; validamos tu identidad con datos que solo tú y Kavak conocen.</div></div>
              <div className="kds-status-strip"><span className="kds-dot" /> Sistema operativo · Respuestas en menos de 1 min</div>
            </div>
          </section>
          <aside style={{ background: "#f8f9fa", display: "flex", flexDirection: "column", padding: "48px 40px", overflowY: "auto" }}>
            <p style={{ margin: "0 0 24px", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa" }}>Vista previa · Portal cliente</p>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ececec", borderTop: "4px solid #EF9F27", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: "24px", maxWidth: 440 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div><p style={{ margin: 0, fontSize: 11, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.8 }}>Número de caso</p><p style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 700 }}>#000001</p></div>
                <span style={{ background: "#FAEEDA", color: "#633806", border: "1px solid #EF9F2730", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>Trabajando</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 15, color: "#555", fontWeight: 500 }}>🚗 KAVA44</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#bbb" }}>📍 Kavak Schiappacasse</p>
              <div style={{ background: "#E5F0FF", border: "1px solid #0066FF20", borderLeft: "4px solid #0066FF", borderRadius: "0 10px 10px 0", padding: "12px 14px", marginTop: 14 }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#0066FF", fontWeight: 600 }}>📋 Solicitud inicial</p>
                <p style={{ margin: 0, fontSize: 13, color: "#333" }}>Reingreso por testigo de presión de aceite</p>
              </div>
              <div style={{ marginTop: 16, borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                <button style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: `1.5px solid ${KAVAK_BLUE}`, background: "#fff", color: KAVAK_BLUE, fontWeight: 600, fontSize: 13, cursor: "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <IconPhone /> Necesito contactarme
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: modoInterno?"unset":"100vh", background: modoInterno?"transparent":"#f8f9fa", display: "flex", flexDirection: "column", alignItems: "center", padding: modoInterno?"0":"40px 16px 48px", fontFamily: "var(--font-display)" }}>
      {!modoInterno && <InjectStyles />}
      {!modoInterno && <TopBar onLogo={() => { setCaso(null); setHistorico([]); }} />}
      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 480, marginBottom: 28, marginTop: modoInterno?0:24 }}>
        <input style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid #e0e0e0", background: "#fff", color: "#1a1a1a", fontSize: 15, outline: "none" }} placeholder="Número de caso o patente" value={busqueda} onChange={e => setBusqueda(e.target.value)} onKeyDown={e => e.key==="Enter"&&buscar()} />
        <button onClick={buscar} disabled={loading} style={{ padding: "12px 22px", borderRadius: 12, border: "none", background: KAVAK_BLUE, color: "#fff", fontWeight: 600, cursor: loading?"wait":"pointer", fontSize: 14 }}>{loading?"...":"Buscar"}</button>
      </div>
      {err && <div style={{ background: "#FCEBEB", border: "1px solid #E24B4A40", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 14, color: "#A32D2D", maxWidth: 480, width: "100%" }}>⚠ {err}</div>}
      {caso && cfg && mapped && (
        <div style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: 16, border: "1px solid #ececec", borderTop: `4px solid ${cfg.color}`, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div><p style={{ margin: 0, fontSize: 11, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.8 }}>Número de caso</p><p style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 700 }}>#{caso.numero_caso}</p></div>
            <SubBadge subestado={mapped.subestado} principal={mapped.principal} />
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 15, color: "#555", fontWeight: 500 }}>🚗 {caso.patente}</p>
          {caso.ubicacion && <p style={{ margin: "3px 0 0", fontSize: 13, color: "#bbb" }}>📍 {formatUbicacion(caso.ubicacion)}</p>}
          {comentarioInicial && (
            <div style={{ background: KAVAK_BLUE_LIGHT, border: `1px solid ${KAVAK_BLUE}20`, borderLeft: `4px solid ${KAVAK_BLUE}`, borderRadius: "0 10px 10px 0", padding: "12px 14px", marginTop: 14 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: KAVAK_BLUE, fontWeight: 600 }}>📋 Solicitud inicial</p>
              <p style={{ margin: 0, fontSize: 14, color: "#333" }}>{comentarioInicial}</p>
            </div>
          )}
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginTop: 16 }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#555" }}>Estado del proceso</p>
            <ProgresoCliente historico={historico} comentarios={comentarios} />
          </div>
          {(() => { const ng = comentarios.find(c => c.es_general===true); return ng ? (
            <div style={{ background: KAVAK_BLUE_LIGHT, border: `1px solid ${KAVAK_BLUE}20`, borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: KAVAK_BLUE, fontWeight: 600 }}>💬 Comentario general</p>
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "#333" }}>{ng.comentario}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{formatDate(ng.created_at)}</p>
            </div>
          ) : null; })()}
          {!modoInterno && (
            <div style={{ marginTop: 16, borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
              <button onClick={() => setShowContacto(true)} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: `1.5px solid ${KAVAK_BLUE}`, background: "#fff", color: KAVAK_BLUE, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = KAVAK_BLUE_LIGHT; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                <IconPhone /> Necesito contactarme
              </button>
            </div>
          )}
        </div>
      )}
      {showContacto && caso && <ModalNecesitoContacto caso={caso} onClose={() => setShowContacto(false)} />}
      {showFeedback && caso && <ModalFeedback caso={caso} onClose={() => setShowFeedback(false)} />}
      {!modoInterno && (<>
        <button onClick={() => setShowFeedback(true)} style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: KAVAK_BLUE, border: `1px solid ${KAVAK_BLUE}40`, borderRadius: 12, padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 4px 16px ${KAVAK_BLUE}20`; }}
          onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
          ⭐ Evaluar herramienta de seguimiento
        </button>
        <button onClick={onVolver} style={{ marginTop: 16, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#ccc", textDecoration: "underline" }}>← Volver al inicio</button>
      </>)}
    </div>
  );
}

// ── Panel Interno ─────────────────────────────────────────────────
function PanelInterno({ onCerrarSesion, userEmail }) {
  const [tab, setTab] = useState("backlog");
  const [casos, setCasos] = useState([]); const [comentariosMap, setComentariosMap] = useState({});
  const [solicitudes, setSolicitudes] = useState([]); const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [loading, setLoading] = useState(true); const [errConn, setErrConn] = useState("");
  const [modalComentario, setModalComentario] = useState(null);
  const [modalNotaGeneral, setModalNotaGeneral] = useState(null);
  const [modalHistorial, setModalHistorial] = useState(null);

  const loadCasos = useCallback(async () => {
    setLoading(true);
    try {
      const [casosData, comentariosData] = await Promise.all([getCasos(), getComentarios()]);
      setCasos(casosData);
      const map = {};
      for (const c of comentariosData) { if (!map[c.numero_caso]) map[c.numero_caso] = []; map[c.numero_caso].push(c); }
      setComentariosMap(map); setErrConn("");
    } catch (e) { setErrConn("No se pudo conectar a Supabase."); } finally { setLoading(false); }
  }, []);

  const loadSolicitudes = useCallback(async () => {
    setLoadingSolicitudes(true);
    try { const data = await getSolicitudesPendientes(); setSolicitudes(data); }
    catch (e) { console.warn("Error cargando solicitudes:", e.message); } finally { setLoadingSolicitudes(false); }
  }, []);

  useEffect(() => { loadCasos(); }, [loadCasos]);
  useEffect(() => { if (tab === "contacto") loadSolicitudes(); }, [tab, loadSolicitudes]);

  async function handleMarcarContactado(solicitud) {
    try { await marcarContactado(solicitud.id, userEmail||"Equipo Kavak"); setSolicitudes(prev => prev.filter(s => s.id !== solicitud.id)); }
    catch (e) { alert("No se pudo actualizar: " + e.message); }
  }

  const TABS = [
    { key: "backlog",  label: "Backlog" },
    { key: "contacto", label: "📞 Pendientes de contacto", badge: solicitudes.length > 0 && tab !== "contacto" ? solicitudes.length : null },
    { key: "buscar",   label: "🔍 Buscar caso" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #ececec", padding: "0 24px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ padding: "14px 20px 14px 0", marginRight: 16, borderRight: "1px solid #ececec" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Arial Black',Arial,sans-serif", fontWeight: 900, fontSize: 15, color: KAVAK_BLUE, letterSpacing: 1 }}>KAVAK</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>· Sigue Tu Caso</span>
          </div>
        </div>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "16px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: tab===t.key?600:400, color: tab===t.key?KAVAK_BLUE:"#888", borderBottom: tab===t.key?`2px solid ${KAVAK_BLUE}`:"2px solid transparent", display: "flex", alignItems: "center", gap: 6 }}>
            {t.label}
            {t.badge && <span style={{ background: "#FEECEC", color: "#9F1F23", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{t.badge}</span>}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {loading && <span style={{ fontSize: 12, color: "#bbb" }}>Cargando...</span>}
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: errConn?"#E24B4A":"#1D9E75" }} title={errConn||"Conectado"} />
          {userEmail && <span style={{ fontSize: 12, color: "#aaa", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</span>}
          <button onClick={onCerrarSesion} style={{ fontSize: 12, color: "#E24B4A", background: "none", border: "1px solid #E24B4A40", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Cerrar sesión</button>
        </div>
      </div>
      <div style={{ padding: "24px 20px", maxWidth: 960, margin: "0 auto" }}>
        {errConn && <div style={{ background: "#FCEBEB", border: "1px solid #E24B4A40", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#A32D2D" }}>⚠ {errConn}</div>}
        {tab === "backlog"  && <TabBacklog casos={casos} comentariosMap={comentariosMap} onAgregarComentario={c => setModalComentario(c)} onNotaGeneral={c => setModalNotaGeneral(c)} onVerHistorial={c => setModalHistorial(c)} onRefresh={loadCasos} />}
        {tab === "contacto" && <TabPendientesContacto solicitudes={solicitudes} onMarcarContactado={handleMarcarContactado} onRefresh={loadSolicitudes} loading={loadingSolicitudes} />}
        {tab === "buscar"   && <div><div style={{ marginBottom: 20 }}><h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Buscar caso</h2><p style={{ margin: "2px 0 0", fontSize: 13, color: "#888" }}>Vista de cliente — las búsquedas no se registran en métricas</p></div><PortalCliente modoInterno={true} onVolver={null} /></div>}
      </div>
      {modalComentario  && <Modal title="Agregar comentario" onClose={() => setModalComentario(null)}><ModalComentario caso={modalComentario} onSave={loadCasos} onClose={() => setModalComentario(null)} defaultUser={userEmail} /></Modal>}
      {modalNotaGeneral && <Modal title="📝 Nota general" onClose={() => setModalNotaGeneral(null)}><ModalNotaGeneral caso={modalNotaGeneral} onSave={loadCasos} onClose={() => setModalNotaGeneral(null)} defaultUser={userEmail} /></Modal>}
      {modalHistorial   && <Modal title={`Historial · Caso #${modalHistorial.numero_caso}`} onClose={() => setModalHistorial(null)}><ModalHistorial caso={modalHistorial} comentariosDeCaso={comentariosMap[modalHistorial.numero_caso]||[]} onClose={() => setModalHistorial(null)} /></Modal>}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const [vista, setVista] = useState("inicio");
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("vista") === "cliente") { setVista("cliente"); window.history.replaceState(null, "", window.location.pathname); }
  }, []);
  if (vista === "inicio")  return <PantallaInicio onCliente={() => setVista("cliente")} onInterno={() => setVista("login")} />;
  if (vista === "cliente") return <PortalCliente onVolver={() => setVista("inicio")} />;
  if (vista === "login")   return <LoginInterno onLogin={email => { setUserEmail(email); setVista("interno"); }} onVolver={() => setVista("inicio")} />;
  if (vista === "interno") return <PanelInterno userEmail={userEmail} onCerrarSesion={() => { setUserEmail(""); setVista("inicio"); }} />;
}
