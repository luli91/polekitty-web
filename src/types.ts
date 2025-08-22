export type Role = "user" | "admin";

export interface ClaseReservada {
  fecha: string;
  hora: string;
  nivel: string;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  notificacionesActivas: boolean;
  puedeAnotarse: boolean; 
 clasesReservadas: string[];
  nombre: string;
  apellido: string;
  edad: number | null; 
  telefono: string;
  direccion: {
    calle: string;
    numero: string;
    ciudad: string;
  };
  cuentaCreada?: boolean; 
    telefonoEmergencia1: {
    nombre: string;
    telefono: string;
  };
}
