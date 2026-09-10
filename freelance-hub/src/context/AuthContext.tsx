import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface Ctx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{error: any}>;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;
}
const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e: string, sess: Session | null) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string){
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  }
  async function signIn(email: string, password: string){
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }
  async function signOut(){ await supabase.auth.signOut(); }

  return <AuthCtx.Provider value={{ user, session, loading, signUp, signIn, signOut }}>{children}</AuthCtx.Provider>;
}

export function useAuth(){
  const c = useContext(AuthCtx);
  if(!c) throw new Error("AuthProvider missing");
  return c;
}
