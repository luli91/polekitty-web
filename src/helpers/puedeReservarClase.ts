import dayjs from "dayjs";

interface User {
  uid: string;
  clasesDisponibles: number;
  puedeAnotarse: boolean;
  fechaPago?: { toDate: () => Date };
}

interface Clase {
  fecha?: { toDate: () => Date };
  anotadas?: string[];
  cupo?: number;
}

export const puedeReservarClase = (user: User, clase: Clase) => {
  if (!user?.puedeAnotarse) {
    return { ok: false, mensaje: "No tenés habilitación para anotarte. Pagá tu pack mensual 💸" };
  }

  if (user.clasesDisponibles <= 0) {
    return { ok: false, mensaje: "No tenés clases disponibles. Comprá un pack para continuar 💫" };
  }

  const fechaPago = user.fechaPago?.toDate?.();
  const fechaClase = clase.fecha?.toDate?.();

  if (!fechaPago || !fechaClase) {
    return { ok: false, mensaje: "Error al validar fechas. Intentá de nuevo." };
  }

  if (dayjs(fechaClase).month() !== dayjs(fechaPago).month()) {
    return { ok: false, mensaje: "Tu pack es válido solo dentro del mes abonado 📆" };
  }

  const cupoMaximo = clase.cupo || 10;
  const cantidadAnotadas = clase.anotadas?.length || 0;

  if (cantidadAnotadas >= cupoMaximo) {
    return { ok: false, mensaje: "Esta clase ya está llena 😢" };
  }

  return { ok: true };
};

