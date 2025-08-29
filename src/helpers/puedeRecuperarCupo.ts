import dayjs from "dayjs";

export const puedeRecuperarCupo= (fechaClaseStr: string): boolean => {
  const ahora = dayjs();
  const fechaClase = dayjs(fechaClaseStr);
  return fechaClase.diff(ahora, "hour") >= 24;
};
