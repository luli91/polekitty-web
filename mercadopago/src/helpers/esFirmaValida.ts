import * as crypto from "crypto";
import { Request } from "firebase-functions/v1";

export const esFirmaValida = (req: Request, claveSecreta: string): boolean => {
  const firmaEnviada = req.headers["x-signature"] as string;
  const cuerpo = JSON.stringify(req.body);
  const firmaEsperada = crypto
    .createHmac("sha256", claveSecreta)
    .update(cuerpo)
    .digest("hex");

  return firmaEnviada === firmaEsperada;
};
