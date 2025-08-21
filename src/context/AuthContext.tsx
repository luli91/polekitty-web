import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ensureUserProfile } from "../services/auth";
import type { UserData } from "../types";

interface AuthContextValue {
  user: UserData | null;
  loading: boolean;
  setUser: (user: UserData | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUid(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await ensureUserProfile(firebaseUser);
        setUser(userData);
        setUid(firebaseUser.uid); 
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        setUser(null);
        setUid(null);
      }

      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);
    const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data) {
        setUser(data as UserData);
      }
    });

    return () => unsubscribeSnapshot();
  }, [uid]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
