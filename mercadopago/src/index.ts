import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import mercadopago from "mercadopago";
import { esFirmaValida } from "./helpers/esFirmaValida";
import { onPagoAprobado } from "../functions/onPagoAprobado";
import cors from "cors";

admin.initializeApp();

mercadopago.configure({
  access_token: "APP_USR-3513551349994681-091617-5e28a1a1d3cb9090e193c33fcf0f4d60-184125453",
});
const CLAVE_SECRETA = "f7f53b568ff33111b427483d6cec11a0c7483378755d0c2ea5190ea47d69b2d0";

const corsHandler = cors({ origin: true });

//  Función para crear preferencia de pago
export const crearPreferencia = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { uid, nombrePack, precio, clases } = req.body;

      if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

    if (!uid || !nombrePack || !precio || !clases) {
      console.log("Datos incompletos en la solicitud");
      res.status(400).send("Faltan datos");
      return;
    }

    const preference = {
      items: [{ title: nombrePack, quantity: 1, unit_price: precio }],
      back_urls: {
        success: "https://polekitty.netlify.app/pago-exitoso",
        failure: "https://polekitty.netlify.app/pago-fallido",
      },
      auto_return: "approved",
      metadata: { uid, clases },
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      console.log("Preferencia creada:", response.body.id);
      res.json({ preferenceId: response.body.id, init_point: response.body.init_point });
    } catch (error) {
      console.error("Error al crear preferencia:", error);
      res.status(500).send("Error al generar preferencia");
    }
  });
});


// Webhook para actualizar clasesDisponibles tras pago aprobado
export const mercadoPagoWebhook = functions.https.onRequest(async (req, res): Promise<void> => {
  if (!esFirmaValida(req, CLAVE_SECRETA)) {
    console.warn("Firma inválida. Evento rechazado.");
    res.status(401).send("Firma inválida");
    return;
  }
  
    const { type, data } = req.body;

  if (type !== "payment") {
    console.log(" Evento no relevante:", type);
    res.sendStatus(200);
    return;
  }

  try {
    const paymentId = data.id;
    const payment = await mercadopago.payment.findById(paymentId);

    if (payment.body.status !== "approved") {
      console.log(" Pago no aprobado aún");
      res.sendStatus(200);
      return;
    }

    const uid = payment.body.metadata.uid;
    const clases = payment.body.metadata.clases;

    if (!uid || !clases) {
      console.log("Metadata incompleta en el pago");
      res.sendStatus(400);
      return;
    }

    await onPagoAprobado(uid, clases);

    const pagoRef = admin.firestore().collection("pagos").doc(uid).collection("historial").doc(paymentId.toString());

await pagoRef.set({
  fecha: admin.firestore.Timestamp.now(),
  pack: payment.body.additional_info?.items?.[0]?.title || "Pack Polekitty",
  clases,
  monto: payment.body.transaction_amount,
  tipo: "mercadoPago",
  metodo: "checkout",
  estado: "aprobado"
});

    console.log(` Clases asignadas a ${uid}: +${clases}`);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});
