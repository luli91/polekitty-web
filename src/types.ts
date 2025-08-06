export type Role = "user" | "admin";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "user";
  notificacionesActivas: boolean;
  clasesReservadas: string[];
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  direccion: {
    calle: string;
    numero: string;
    ciudad: string;
  };
}

