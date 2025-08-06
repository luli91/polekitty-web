import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { UserData } from "../types";

interface AuthContextValue {
  user: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log("Cambio en estado de autenticación:", firebaseUser);

    if (!firebaseUser) {
      console.warn("No hay usuario autenticado.");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      console.log("Snapshot del usuario autenticado:", snapshot.exists() ? snapshot.data() : "No existe en Firestore");

      if (snapshot.exists()) {
  const data = snapshot.data();

  const userData: UserData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "Sin email",
    displayName: data.displayName ?? "Sin nombre",
    role: data.role ?? "user",
    notificacionesActivas: data.notificacionesActivas ?? true,
    clasesReservadas: Array.isArray(data.clasesReservadas) ? data.clasesReservadas : [],
    nombre: data.nombre ?? "",
    apellido: data.apellido ?? "",
    edad: data.edad ?? 0,
    telefono: data.telefono ?? "",
    direccion: {
      calle: data.direccion?.calle ?? "",
      numero: data.direccion?.numero ?? "",
      ciudad: data.direccion?.ciudad ?? "",
    },
  };

  console.log("Usuario normalizado:", userData);
  setUser(userData);
}
 else {
        console.warn("Usuario logueado pero no encontrado en Firestore.");
        setUser(null);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      setUser(null);
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
