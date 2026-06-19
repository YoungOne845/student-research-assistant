import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage(){
  const { login } = useAuth(); const nav=useNavigate(); const [error,setError]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){ e.preventDefault(); const fd=new FormData(e.currentTarget); try{ await login(String(fd.get('email')),String(fd.get('password'))); nav('/dashboard'); }catch{ setError('Invalid login details'); } }
  return <AuthShell title="Welcome back" subtitle="Continue your research journey."><form onSubmit={submit} className="space-y-4"><input className="input" name="email" type="email" placeholder="Email"/><input className="input" name="password" type="password" placeholder="Password"/><button className="btn w-full">Login</button>{error&&<p className="text-sm text-red-300">{error}</p>}<p className="text-sm text-slate-400">No account? <Link className="text-brand-500" to="/register">Create one</Link></p></form></AuthShell>
}
function AuthShell({title,subtitle,children}:{title:string;subtitle:string;children:React.ReactNode}){return <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#4c1d95,transparent_35%),#020617] p-4"><div className="card w-full max-w-md"><h1 className="text-3xl font-bold">{title}</h1><p className="mb-6 mt-2 text-slate-400">{subtitle}</p>{children}</div></div>}
