// Mapa fijo email → Slack User ID
const SLACK_USER_MAP = {
  "luis.arrue@kavak.com":          "U038Q9CDJE4",
  "sebastian.inzunza@kavak.com":   "U075V8RS5H8",
  "hector.sanchezmunoz@kavak.com": "U098RKBM2NP",
  "dustin.reyes@kavak.com":        "U0ALFB5T2A3",
  "hugo.tapia1@kavak.com":         "U05UFQT796U",
};

export default async function handler(req, res) {

  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido"
    });
  }

  try {

    /*************************************************
     * BODY
     *************************************************/

    const {
      numero_caso,
      patente,
      mensaje,
      estado,
      correo
    } = req.body;


    /*************************************************
     * ENV
     *************************************************/

    const SLACK_TOKEN =
      process.env.VITE_SLACK_TOKEN;

    const SLACK_CHANNEL_ID =
      process.env.VITE_SLACK_CHANNEL_ID;


    /*************************************************
     * VALIDAR ENV
     *************************************************/

    if (!SLACK_TOKEN || !SLACK_CHANNEL_ID) {

      return res.status(500).json({
        ok: false,
        error: "Faltan variables de entorno Slack"
      });
    }


    /*************************************************
     * RESOLVER RESPONSABLE
     *************************************************/

    // 2026-11-04: el "correo" que llega puede ser el de un CLIENTE (bbdd_cc.correo trae correos externos). Solo se
    // etiqueta / nombra como responsable a gente de Kavak: si el correo no es @kavak.com no se muestra (no se
    // expone el correo de un cliente en el canal y no se lo pone como "responsable").
    const correoLimpio = correo ? correo.trim().toLowerCase() : "";
    const esKavak = /@kavak\.com$/.test(correoLimpio);

    let slackId = esKavak ? SLACK_USER_MAP[correoLimpio] : null;

    // 2026-11-06: si el KAM no está en el mapa fijo, se lo busca en Slack por su correo (users.lookupByEmail; el bot
    // necesita el permiso users:read.email — si no lo tiene o no lo encuentra, se sigue sin etiquetar, sin romper nada).
    if (esKavak && !slackId) {
      try {
        const rUser = await fetch(
          "https://slack.com/api/users.lookupByEmail?email=" + encodeURIComponent(correoLimpio),
          { headers: { Authorization: `Bearer ${SLACK_TOKEN}` } }
        );
        const dUser = await rUser.json();
        if (dUser.ok && dUser.user && dUser.user.id) slackId = dUser.user.id;
        else console.warn("notify-slack: lookupByEmail no resolvió " + correoLimpio + ": " + (dUser.error || "sin usuario"));
      } catch (eLookup) {
        console.warn("notify-slack: lookupByEmail falló: " + eLookup.message);
      }
    }

    const mencion = slackId
      ? `<@${slackId}>`
      : esKavak
      ? `_${correoLimpio}_`
      : "_sin asignar_";


    /*************************************************
     * FECHA CHILE
     *************************************************/

    const fechaChile = new Date().toLocaleString(
      "es-CL",
      {
        timeZone: "America/Santiago",
      }
    );


    /*************************************************
     * MENSAJE SLACK
     *************************************************/

    const texto =
      "🚨 *Un cliente quiere ser contactado — Sigue Tu Caso*\n\n" +

      `*Número caso:* ${
        numero_caso || "_sin dato_"
      }\n` +

      `*Patente:* ${
        patente || "_sin dato_"
      }\n` +

      `*Mensaje:* ${
        mensaje || "_sin dato_"
      }\n` +

      `*Estado:* ${
        estado || "_sin dato_"
      }\n` +

      `*Fecha:* ${fechaChile}\n` +

      `*Responsable:* ${mencion}`;


    /*************************************************
     * ENVIAR A SLACK
     *************************************************/

    const response = await fetch(
      "https://slack.com/api/chat.postMessage",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SLACK_TOKEN}`,
        },

        body: JSON.stringify({
          channel: SLACK_CHANNEL_ID,
          text: texto,
        }),
      }
    );

    const data = await response.json();


    /*************************************************
     * ERROR SLACK
     *************************************************/

    if (!data.ok) {

      return res.status(500).json({
        ok: false,
        error: data.error || "Error Slack"
      });
    }


    /*************************************************
     * OK
     *************************************************/

    return res.status(200).json({
      ok: true
    });

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
