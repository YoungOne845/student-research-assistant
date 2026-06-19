import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { User } from '../types';

type AuthContextType = { user: User | null; loading: boolean; login: (email:string,password:string)=>Promise<void>; register: (name:string,email:string,password:string)=>Promise<void>; logout:()=>void };
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/auth/me').then(r => setUser(r.data.user)).catch(()=>setUser(null)).finally(()=>setLoading(false)); }, []);
  async function login(email:string,password:string){ const r=await api.post('/auth/login',{email,password}); localStorage.setItem('sra_token',r.data.token); setUser(r.data.user); }
  async function register(name:string,email:string,password:string){ const r=await api.post('/auth/register',{name,email,password}); localStorage.setItem('sra_token',r.data.token); setUser(r.data.user); }
  function logout(){ localStorage.removeItem('sra_token'); setUser(null); }
  const value = useMemo(()=>({user,loading,login,register,logout}),[user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const ctx=useContext(AuthContext); if(!ctx) throw new Error('useAuth must be used inside AuthProvider'); return ctx; }
