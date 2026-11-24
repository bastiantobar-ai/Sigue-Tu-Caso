import { useState, useEffect, useRef } from "react";

// ── Kavak Service dentro de Sigue tu caso ─────────────────────────
// Dos pestañas: "Agendar service" (valida la patente contra los vouchers enviados y agenda) y "Seguir mi service" (avance, reagendar).
// Habla con el proyecto Kavak Service de Apps Script (API JSON, ver kavak-service/Api.gs). Los datos siguen en Google Sheets, así que
// Check In, Check Out y Car Control no cambian. apiUrl = URL /exec de la implementación pública (variable VITE_SERVICE_API_URL).

const patenteLimpia = v => String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
const patenteValida = p => /^[A-Z]{2}\d{4}$/.test(p) || /^[A-Z]{4}\d{2}$/.test(p);

const SIN_CONEXION = "No pudimos conectar con Kavak Service. Revisa tu conexión e inténtalo de nuevo.";
async function apiGet(base, params) {
  try {
    const r = await fetch(base + (base.includes("?") ? "&" : "?") + new URLSearchParams(params).toString());
    return await r.json();
  } catch (e) { return { ok: false, error: SIN_CONEXION }; }
}
async function apiPost(base, body) {
  try {
    // Texto plano: así el navegador no hace la consulta previa (CORS) que Apps Script no responde.
    const r = await fetch(base, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
    return await r.json();
  } catch (e) { return { ok: false, error: SIN_CONEXION }; }
}

// ── estilos locales (usan las variables del sistema de diseño de Sigue tu caso) ──
const S = {
  wrap: { width: "100%", maxWidth: 760, margin: "0 auto", padding: "28px 16px 56px", fontFamily: "var(--font-display)", color: "var(--ink)" },
  card: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 24, marginBottom: 18 },
  h1: { fontSize: 34, lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 600, margin: "6px 0 8px" },
  eyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--kavak-blue)" },
  sub: { color: "var(--ink-3)", fontSize: 15, lineHeight: 1.5, margin: "0 0 4px" },
  lab: { display: "block", fontSize: 13, fontWeight: 600, margin: "16px 0 8px" },
  small: { fontWeight: 400, color: "var(--muted)", marginLeft: 6 },
  err: { color: "#C0392B", fontSize: 14, minHeight: 20, margin: "10px 0" },
  ok: { background: "var(--kavak-blue-hint)", border: "1px solid var(--kavak-blue-edge)", color: "var(--kavak-blue-ink)", borderRadius: "var(--r-md)", padding: "12px 16px", fontSize: 14, margin: "12px 0" },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  muted: { color: "var(--muted)", fontSize: 14 },
};
const chip = on => ({ appearance: "none", cursor: "pointer", font: "inherit", fontSize: 14, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${on ? "var(--kavak-blue)" : "var(--line)"}`, background: on ? "var(--kavak-blue-hint)" : "var(--paper)", color: on ? "var(--kavak-blue-ink)" : "var(--ink-3)", fontWeight: on ? 600 : 400 });
const chipOff = { opacity: 0.45, cursor: "not-allowed" };
const inputBox = { width: "100%", boxSizing: "border-box", padding: "13px 14px", fontSize: 16, border: "1px solid var(--line)", borderRadius: "var(--r-md)", fontFamily: "inherit", color: "var(--ink)", background: "var(--paper)" };

function Boton({ children, onClick, disabled, ghost, type }) {
  return <button type={type || "button"} className={`kds-btn ${ghost ? "" : "kds-btn--primary"}`} disabled={disabled} onClick={onClick}
    style={ghost ? { background: "transparent", border: "1px solid var(--line)", color: "var(--ink-3)", opacity: disabled ? 0.6 : 1 } : { opacity: disabled ? 0.6 : 1, cursor: disabled ? "wait" : "pointer" }}>{children}</button>;
}

// ═════════════════════════════ AGENDAR ═════════════════════════════
function Agendar({ apiUrl, onSeguir, patenteInicial }) {
  const [paso, setPaso] = useState("voucher");          // voucher | form | listo | yaAgendada
  const [patente, setPatente] = useState(patenteInicial || "");
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cfg, setCfg] = useState(null);
  const [svc, setSvc] = useState("");
  const [site, setSite] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horas, setHoras] = useState(null);             // null = cargando; { horas:[{hora,libre}], diaLleno, error }
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [res, setRes] = useState(null);
  const pedido = useRef(0);

  async function validar() {
    const pat = patenteLimpia(patente);
    if (!patenteValida(pat)) { setMsg("La patente no es válida. Ejemplos: BCDF12 o AB1234."); return; }
    setCargando(true); setMsg("");
    const v = await apiGet(apiUrl, { api: "voucher", patente: pat });
    if (!v.ok) { setCargando(false); setMsg(v.error || SIN_CONEXION); return; }
    if (!v.registrada) { setCargando(false); setMsg(v.mensaje || "Lo lamentamos, no tenemos registros de un service para tu patente."); return; }
    setPatente(pat);
    if (v.yaAgendada) { setCargando(false); setPaso("yaAgendada"); return; }
    const c = await apiGet(apiUrl, { api: "config" });
    setCargando(false);
    if (!c || !c.servicios) { setMsg((c && c.error) || "No se pudo cargar el formulario. Inténtalo de nuevo."); return; }
    setCfg(c); setSvc(c.servicios[0] ? c.servicios[0].id : ""); setSite(c.sites[0] ? c.sites[0].id : ""); setFecha(c.fechas[0] ? c.fechas[0].iso : "");
    setPaso("form");
  }

  // Horas libres cada vez que cambia el servicio, el site o el día. Se ignora una respuesta que llega tarde.
  useEffect(() => {
    if (paso !== "form" || !svc || !site || !fecha) return;
    const n = ++pedido.current; setHoras(null); setHora("");
    apiGet(apiUrl, { api: "horas", site, fecha, servicio: svc }).then(r => { if (n === pedido.current) setHoras(r || { error: SIN_CONEXION }); });
  }, [paso, svc, site, fecha, apiUrl]);

  async function agendar() {
    if (!hora) { setMsg("Elige una hora."); return; }
    if (nombre.trim().length < 3) { setMsg("Escribe tu nombre."); return; }
    if (tel.length !== 9) { setMsg("El teléfono debe tener 9 dígitos."); return; }
    if (cfg.emailObligatorio && !email.trim()) { setMsg("Escribe tu correo para recibir el comprobante."); return; }
    setCargando(true); setMsg("");
    const r = await apiPost(apiUrl, { api: "agendar", patente, servicio: svc, site, fecha, hora, nombre, telefono: tel, email });
    setCargando(false);
    if (!r.ok) {
      setMsg(r.error || "No se pudo agendar. Inténtalo de nuevo.");
      if (r.sinVoucher) setPaso("voucher");
      else if (r.yaAgendada) setPaso("yaAgendada");
      else if (r.refrescar) { const n = ++pedido.current; setHoras(null); setHora(""); apiGet(apiUrl, { api: "horas", site, fecha, servicio: svc }).then(h => { if (n === pedido.current) setHoras(h); }); }
      return;
    }
    setRes(r); setPaso("listo");
  }

  if (paso === "voucher") return (
    <div style={S.card}>
      <span style={S.eyebrow}>Agendar service</span>
      <h1 style={S.h1}>Agenda tu service<span style={{ color: "var(--kavak-blue)" }}>.</span></h1>
      <p style={S.sub}>¿Ya recibiste tu voucher? Ingresa tu patente para agendar tu cita.</p>
      <label style={S.lab} htmlFor="svc-patente">Patente <span style={S.small}>BCDF12 o AB1234</span></label>
      <div className="kds-input-wrap"><input id="svc-patente" className="kds-input kds-input--mono" value={patente} maxLength={6} autoComplete="off" placeholder="BCDF12"
        onChange={e => { setPatente(patenteLimpia(e.target.value)); setMsg(""); }} onKeyDown={e => { if (e.key === "Enter") validar(); }} /></div>
      <div role="alert" style={S.err}>{msg}</div>
      <Boton onClick={validar} disabled={cargando}>{cargando ? "Revisando…" : "Continuar"}</Boton>
    </div>
  );

  if (paso === "yaAgendada") return (
    <div style={S.card}>
      <span style={S.eyebrow}>Agendar service</span>
      <h1 style={S.h1}>Ya tienes un service agendado<span style={{ color: "var(--kavak-blue)" }}>.</span></h1>
      <p style={S.sub}>La patente {patente} ya tiene una cita. Puedes ver cómo va tu service y, si lo necesitas, cambiar tu hora.</p>
      <div style={{ marginTop: 18 }}><Boton onClick={() => onSeguir(patente)}>Seguir mi service</Boton></div>
    </div>
  );

  if (paso === "listo") return (
    <div style={S.card}>
      <span style={S.eyebrow}>Kavak Service</span>
      <h1 style={S.h1}>Hora agendada<span style={{ color: "var(--kavak-blue)" }}>.</span></h1>
      <p style={S.sub}>{res.servicio} en {res.site}, {res.fechaTxt} a las {res.hora}. Patente {res.patente}.</p>
      <div style={S.ok}>Con tu patente puedes seguir el estado de tu service y cambiar tu hora.{email.trim() ? " Te enviamos un correo con los detalles." : ""}</div>
      <Boton onClick={() => onSeguir(res.patente)}>Seguir mi service</Boton>
    </div>
  );

  const servicio = cfg.servicios.find(s => s.id === svc);
  return (
    <div>
      <div style={S.card}>
        <span style={S.eyebrow}>Agendar service</span>
        <h1 style={S.h1}>Elige tu hora<span style={{ color: "var(--kavak-blue)" }}>.</span></h1>
        <p style={S.sub}>Patente <b>{patente}</b> · tu voucher está registrado.</p>

        <span style={S.lab}>Servicio</span>
        <div style={S.chips}>{cfg.servicios.map(s => <button key={s.id} type="button" style={chip(s.id === svc)} onClick={() => setSvc(s.id)} aria-pressed={s.id === svc}>{s.nombre}</button>)}</div>
        {servicio && servicio.incluye && servicio.incluye.length > 0 && <p style={{ ...S.muted, marginTop: 10 }}>Incluye: {servicio.incluye.join(" · ")}</p>}

        <label style={S.lab} htmlFor="svc-site">Site</label>
        <select id="svc-site" style={inputBox} value={site} onChange={e => setSite(e.target.value)}>{cfg.sites.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select>

        <span style={S.lab}>Día <span style={S.small}>lunes a viernes, con al menos {cfg.diasMinimos} días de anticipación</span></span>
        <div style={S.chips}>{cfg.fechas.map(f => <button key={f.iso} type="button" style={chip(f.iso === fecha)} onClick={() => setFecha(f.iso)} aria-pressed={f.iso === fecha}>{f.label}</button>)}</div>

        <span style={S.lab}>Hora</span>
        {horas === null ? <p style={S.muted}>Buscando horas libres…</p>
          : horas.error ? <p style={S.muted}>{horas.error}</p>
          : horas.diaLleno ? <p style={S.muted}>Este día ya no tiene horas disponibles en este site. Prueba otro día.</p>
          : !horas.horas || !horas.horas.length ? <p style={S.muted}>No hay horas para este día.</p>
          : <div style={S.chips}>{horas.horas.map(h => <button key={h.hora} type="button" disabled={!h.libre} style={{ ...chip(h.hora === hora), ...(h.libre ? {} : chipOff) }} onClick={() => setHora(h.hora)} aria-pressed={h.hora === hora}>{h.hora}</button>)}</div>}
        {horas && horas.horas && horas.horas.length > 0 && !horas.diaLleno && !horas.horas.some(h => h.libre) && <p style={S.muted}>No queda espacio este día para este servicio. Prueba otro día.</p>}
      </div>

      <div style={S.card}>
        <span style={S.eyebrow}>Tus datos</span>
        <label style={S.lab} htmlFor="svc-nombre">Nombre</label>
        <input id="svc-nombre" style={inputBox} value={nombre} autoComplete="name" onChange={e => setNombre(e.target.value)} />
        <label style={S.lab} htmlFor="svc-tel">Teléfono <span style={S.small}>9 dígitos</span></label>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ ...S.muted, fontSize: 16 }}>+56</span>
          <input id="svc-tel" style={inputBox} inputMode="numeric" maxLength={9} placeholder="912345678" value={tel}
            onChange={e => { let v = e.target.value.replace(/\D/g, ""); if (v.length > 9 && v.indexOf("56") === 0) v = v.slice(2); setTel(v.slice(0, 9)); }} /></div>
        <label style={S.lab} htmlFor="svc-email">Correo <span style={S.small}>{cfg.emailObligatorio ? "Obligatorio" : "Opcional"}</span></label>
        <input id="svc-email" style={inputBox} type="email" value={email} autoComplete="email" placeholder="tu@correo.cl" onChange={e => setEmail(e.target.value)} />
        <div style={S.ok}>Tu hora queda pendiente hasta que tengamos los repuestos. Si algo cambia, te contactamos para elegir otro día.</div>
        <div role="alert" style={S.err}>{msg}</div>
        <Boton onClick={agendar} disabled={cargando}>{cargando ? "Agendando…" : "Agendar hora"}</Boton>
      </div>
    </div>
  );
}

// ═════════════════════════════ SEGUIR ═════════════════════════════
function Seguir({ apiUrl, patenteInicial }) {
  const [patente, setPatente] = useState(patenteInicial || "");
  const [d, setD] = useState(null);                     // respuesta de seguimiento
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const [actualizado, setActualizado] = useState("");
  const [rg, setRg] = useState(null);                   // reagendar: { opc, fecha, hora, ocupado, error }
  const [exito, setExito] = useState("");
  const AY0 = { abierto: false, mensaje: "", ocupado: false, ok: "", error: "" };
  const [ay, setAy] = useState(AY0);                    // ayuda: alerta a Slack, con mensaje opcional
  const [cn, setCn] = useState(null);                  // cancelar: { ocupado, error } mientras se pide la confirmación
  const pat = useRef("");

  async function cargar(p, silencioso) {
    if (!silencioso) { setCargando(true); setMsg(""); }
    const r = await apiGet(apiUrl, { api: "seguimiento", patente: p });
    if (!silencioso) setCargando(false);
    if (!r.ok) { if (!silencioso) { setD(null); setMsg(r.error || SIN_CONEXION); } return; }
    pat.current = p; setD(r);
    const h = new Date(); setActualizado(("0" + h.getHours()).slice(-2) + ":" + ("0" + h.getMinutes()).slice(-2));
  }
  function buscar() {
    const p = patenteLimpia(patente);
    if (!patenteValida(p)) { setMsg("La patente no es válida. Ejemplos: BCDF12 o AB1234."); return; }
    setRg(null); setCn(null); setAy(AY0); setExito(""); cargar(p, false);
  }
  useEffect(() => { const p = patenteLimpia(patenteInicial); if (patenteValida(p)) cargar(p, false); }, []);          // link directo con la patente cargada
  useEffect(() => { const t = setInterval(() => { if (pat.current && !document.hidden) cargar(pat.current, true); }, 60000); return () => clearInterval(t); }, []);

  async function abrirReagendar() {
    setExito(""); setRg({ ocupado: true });
    const o = await apiGet(apiUrl, { api: "reagendar_opciones", patente: pat.current });
    if (!o.ok) { setRg({ error: o.error || SIN_CONEXION }); return; }
    setRg({ opc: o, fecha: "", hora: "" });
  }
  async function confirmar() {
    setRg(x => ({ ...x, ocupado: true, error: "" }));
    const r = await apiPost(apiUrl, { api: "reagendar", patente: pat.current, fecha: rg.fecha, hora: rg.hora });
    if (!r.ok) {
      if (r.refrescar) { const o = await apiGet(apiUrl, { api: "reagendar_opciones", patente: pat.current }); setRg(o.ok ? { opc: o, fecha: rg.fecha, hora: "", error: r.error } : { error: o.error || r.error }); }
      else setRg(x => ({ ...x, ocupado: false, error: r.error || SIN_CONEXION }));
      return;
    }
    setRg(null); setExito(`Listo, cambiamos tu hora al ${r.fechaTxt} a las ${r.hora}.` + (r.correo ? " Te enviamos un correo con el detalle." : ""));
    cargar(pat.current, true);
  }

  // Ayuda: manda una alerta a Slack (por Apps Script) para que un agente contacte al cliente durante el día.
  async function pedirAyuda() {
    setAy(x => ({ ...x, ocupado: true, ok: "", error: "" }));
    const r = await apiPost(apiUrl, { api: "ayuda", patente: pat.current, mensaje: ay.mensaje || "" });
    if (!r.ok) { setAy(x => ({ ...x, ocupado: false, error: r.error || SIN_CONEXION })); return; }
    setAy({ abierto: false, mensaje: "", ocupado: false, ok: (r.repetido || r.limite ? "Ya avisamos a nuestro equipo. " : "Listo, avisamos a nuestro equipo. ") + "Un agente se contactará contigo durante el día.", error: "" });
  }

  // Cancelar: solo lo hace el cliente (el KAM solo reagenda). Pide confirmación y libera la hora.
  async function cancelarCita() {
    setCn(x => ({ ...x, ocupado: true, error: "" }));
    const r = await apiPost(apiUrl, { api: "cancelar", patente: pat.current });
    if (!r.ok) { setCn(x => ({ ...x, ocupado: false, error: r.error || SIN_CONEXION })); return; }
    setCn(null); setRg(null);
    setExito("Listo, tu cita fue cancelada." + (r.correo ? " Te enviamos un correo de confirmación." : "") + " Si quieres, puedes agendar una nueva hora cuando te acomode.");
    cargar(pat.current, true);
  }

  return (
    <div>
      <div style={S.card}>
        <span style={S.eyebrow}>Seguimiento</span>
        <h1 style={S.h1}>Tu service<span style={{ color: "var(--kavak-blue)" }}>.</span></h1>
        <p style={S.sub}>Ingresa la patente de tu auto para ver en qué paso va tu service.</p>
        <label style={S.lab} htmlFor="seg-patente">Patente</label>
        <div className="kds-input-wrap"><input id="seg-patente" className="kds-input kds-input--mono" value={patente} maxLength={6} autoComplete="off" placeholder="BCDF12"
          onChange={e => { setPatente(patenteLimpia(e.target.value)); setMsg(""); }} onKeyDown={e => { if (e.key === "Enter") buscar(); }} /></div>
        <div role="alert" style={S.err}>{msg}</div>
        <Boton onClick={buscar} disabled={cargando}>{cargando ? "Buscando…" : "Ver mi service"}</Boton>
      </div>

      {d && (
        <div style={S.card}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", fontSize: 14, color: "var(--ink-3)", marginBottom: 14 }}>
            <span>Patente <b style={{ color: "var(--ink)" }}>{d.patente}</b></span><span>Servicio <b style={{ color: "var(--ink)" }}>{d.servicio}</b></span>
            <span>Cita <b style={{ color: "var(--ink)" }}>{d.fechaTxt} · {d.hora}</b></span><span>Site <b style={{ color: "var(--ink)" }}>{d.site}</b></span>
          </div>
          {d.mensaje && <div style={S.ok}>{d.mensaje}</div>}
          {d.reagendada && <p style={{ ...S.muted, margin: "8px 0" }}>Tu cita fue reagendada: de {d.reagendada.de} a {d.reagendada.a}.</p>}
          <ol style={{ listStyle: "none", padding: 0, margin: "18px 0 0" }}>
            {(d.pasos || []).map((p, i) => (
              <li key={i} style={{ display: "flex", gap: 14, padding: "10px 0", opacity: p.estado === "pendiente" ? 0.5 : 1 }}>
                <span style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700,
                  background: p.estado === "hecho" ? "var(--kavak-blue)" : "var(--paper)", color: p.estado === "hecho" ? "#fff" : "var(--kavak-blue)", border: "2px solid var(--kavak-blue)" }}>{p.estado === "hecho" ? "✓" : i + 1}</span>
                <span><b>{p.label}</b>{p.detalle && <span style={{ display: "block", ...S.muted }}>{p.detalle}</span>}</span>
              </li>))}
          </ol>

          {exito && <div style={S.ok}>{exito}</div>}
          {(d.puedeReagendar && !rg && !cn) || (d.puedeCancelar && !cn && !rg) ? (
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {d.puedeReagendar && !rg && <Boton onClick={abrirReagendar}>Quiero reagendar</Boton>}
              {d.puedeCancelar && <Boton ghost onClick={() => { setExito(""); setCn({ ocupado: false, error: "" }); }}>Cancelar mi cita</Boton>}
            </div>) : null}
          {cn && (
            <div style={{ borderTop: "1px solid var(--line)", marginTop: 18, paddingTop: 18 }}>
              <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 600 }}>Cancelar mi cita</h2>
              <p style={S.sub}>¿Seguro que quieres cancelar tu cita? La hora quedará libre para otro cliente. Si solo necesitas otro día, mejor usa <b>Quiero reagendar</b>.</p>
              <div role="alert" style={S.err}>{cn.error}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Boton onClick={cancelarCita} disabled={cn.ocupado}>{cn.ocupado ? "Cancelando…" : "Sí, cancelar mi cita"}</Boton>
                <Boton ghost onClick={() => setCn(null)}>Volver</Boton>
              </div>
            </div>)}
          {!d.puedeReagendar && d.reagendarMsg && <p style={{ ...S.muted, marginTop: 14 }}>{d.reagendarMsg}</p>}

          {rg && (
            <div style={{ borderTop: "1px solid var(--line)", marginTop: 18, paddingTop: 18 }}>
              <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 600 }}>Reagendar mi hora</h2>
              {rg.ocupado && !rg.opc && <p style={S.muted}>Buscando los horarios disponibles…</p>}
              {rg.opc && (<>
                <p style={S.sub}>Tu hora actual es <b>{rg.opc.actual.fechaTxt} a las {rg.opc.actual.hora}</b>. Puedes elegir una hora posterior a esa.{rg.opc.etaTxt ? <> Como tus repuestos llegan después, solo puedes elegir desde el <b>{rg.opc.etaTxt}</b>.</> : null}</p>
                <span style={S.lab}>Elige un nuevo día</span>
                <div style={S.chips}>{rg.opc.fechas.length ? rg.opc.fechas.map(f => <button key={f.iso} type="button" disabled={!f.libres} style={{ ...chip(f.iso === rg.fecha), ...(f.libres ? {} : chipOff) }} onClick={() => setRg(x => ({ ...x, fecha: f.iso, hora: "", error: "" }))}>{f.label} <small>{f.libres ? f.libres + (f.libres === 1 ? " hora" : " horas") : "sin horas"}</small></button>) : <p style={S.muted}>No hay días disponibles por ahora. Contáctanos para ayudarte.</p>}</div>
                {rg.fecha && (<>
                  <span style={S.lab}>Elige la hora</span>
                  <div style={S.chips}>{(rg.opc.horas[rg.fecha] || []).filter(h => h.libre).map(h => <button key={h.hora} type="button" style={chip(h.hora === rg.hora)} onClick={() => setRg(x => ({ ...x, hora: h.hora, error: "" }))}>{h.hora}</button>)}
                    {!(rg.opc.horas[rg.fecha] || []).some(h => h.libre) && <p style={S.muted}>Ese día ya no tiene horas libres. Elige otro.</p>}</div>
                </>)}
              </>)}
              <div role="alert" style={S.err}>{rg.error}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {rg.opc && <Boton onClick={confirmar} disabled={!rg.fecha || !rg.hora || rg.ocupado}>{rg.ocupado ? "Reagendando…" : "Confirmar nueva hora"}</Boton>}
                <Boton ghost onClick={() => setRg(null)}>Cancelar</Boton>
              </div>
            </div>)}
          <div style={{ marginTop: 18 }}>
            {!ay.abierto && <Boton ghost onClick={() => setAy({ ...AY0, abierto: true })}>Necesito ayuda</Boton>}
            {ay.abierto && (
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 600 }}>Necesito ayuda</h2>
                <p style={S.sub}>Un agente se contactará contigo durante el día. Si quieres, cuéntanos qué necesitas (es opcional).</p>
                <textarea rows={3} maxLength={300} value={ay.mensaje} placeholder="Ej: necesito cambiar el día de mi cita"
                  onChange={e => setAy(x => ({ ...x, mensaje: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", font: "inherit", padding: 10, border: "1px solid var(--line)", borderRadius: 10 }} />
                <p style={{ ...S.muted, fontSize: 12, margin: "4px 0 10px" }}>{ay.mensaje.length} / 300</p>
                <div role="alert" style={S.err}>{ay.error}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Boton onClick={pedirAyuda} disabled={ay.ocupado}>{ay.ocupado ? "Enviando…" : "Enviar"}</Boton>
                  <Boton ghost onClick={() => setAy(AY0)}>Volver</Boton>
                </div>
              </div>)}
            {ay.ok && <div style={{ ...S.ok, marginTop: 10 }}>{ay.ok}</div>}
          </div>
          <p style={{ ...S.muted, fontSize: 12, marginTop: 16 }}>Actualizado a las {actualizado}. Se actualiza solo cada minuto.</p>
        </div>)}
    </div>
  );
}

// ═════════════════════════════ PORTAL ═════════════════════════════
export default function PortalService({ apiUrl, top, onVolver, tabInicial, patenteInicial }) {
  const [tab, setTab] = useState(tabInicial === "seguir" ? "seguir" : "agendar");
  const [patente, setPatente] = useState(patenteInicial || "");
  const [vez, setVez] = useState(0);                    // al venir de "Seguir mi service" tras agendar se vuelve a montar con la patente
  const irASeguir = p => { setPatente(p); setVez(v => v + 1); setTab("seguir"); window.scrollTo && window.scrollTo(0, 0); };
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {top}
      <div style={S.wrap}>
        {onVolver && <button type="button" onClick={onVolver} style={{ appearance: "none", border: 0, background: "none", cursor: "pointer", color: "var(--muted)", fontSize: 14, padding: 0, marginBottom: 14 }}>← Volver al inicio</button>}
        <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[["agendar", "Agendar service"], ["seguir", "Seguir mi service"]].map(([k, l]) =>
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} style={{ ...chip(tab === k), padding: "11px 18px", fontSize: 15 }}>{l}</button>)}
        </div>
        {!apiUrl
          ? <div style={S.card}><b>Falta configurar el servicio.</b><p style={S.muted}>Define la variable VITE_SERVICE_API_URL con la URL /exec de Kavak Service y vuelve a publicar.</p></div>
          : tab === "agendar"
            ? <Agendar apiUrl={apiUrl} onSeguir={irASeguir} patenteInicial={patenteInicial} />
            : <Seguir key={vez} apiUrl={apiUrl} patenteInicial={patente} />}
      </div>
    </div>
  );
}
