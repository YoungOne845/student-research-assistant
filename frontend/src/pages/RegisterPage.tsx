import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage(){
  const { register } = useAuth(); const nav=useNavigate(); const [error,setError]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){ e.preventDefault(); const fd=new FormData(e.currentTarget); try{ await register(String(fd.get('name')),String(fd.get('email')),String(fd.get('password'))); nav('/dashboard'); }catch{ setError('Could not create account'); } }
  return <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#4c1d95,transparent_35%),#020617] p-4"><div className="card w-full max-w-md"><h1 className="text-3xl font-bold">Create account</h1><p className="mb-6 mt-2 text-slate-400">Start building better research projects.</p><form onSubmit={submit} className="space-y-4"><input className="input" name="name" placeholder="Full name"/><input className="input" name="email" type="email" placeholder="Email"/><input className="input" name="password" type="password" placeholder="Password, minimum 8 characters"/><button className="btn w-full">Create account</button>{error&&<p className="text-sm text-red-300">{error}</p>}<p className="text-sm text-slate-400">Already registered? <Link className="text-brand-500" to="/login">Login</Link></p></form></div></div>
}
