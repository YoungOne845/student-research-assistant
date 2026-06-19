import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, FolderKanban, LayoutDashboard, LogOut, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  ['Dashboard','/dashboard',LayoutDashboard], ['Research Modules','/modules',Sparkles], ['Projects','/projects',FolderKanban], ['Profile','/profile',User]
] as const;
export function AppLayout(){
  const { user, logout } = useAuth();
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#312e81,transparent_35%),#020617]">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl md:block">
      <Link to="/dashboard" className="flex items-center gap-3 text-xl font-bold"><BookOpen className="text-brand-500"/> SRA</Link>
      <nav className="mt-10 space-y-2">{nav.map(([label,to,Icon])=><NavLink key={to} to={to} className={({isActive})=>`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${isActive?'bg-white/10 text-white':'text-slate-300 hover:bg-white/5'}`}><Icon size={18}/>{label}</NavLink>)}</nav>
      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/5 p-4"><p className="text-sm font-semibold">{user?.name}</p><p className="text-xs text-slate-400">{user?.email}</p><button onClick={logout} className="mt-3 flex items-center gap-2 text-sm text-red-300"><LogOut size={16}/> Logout</button></div>
    </aside>
    <main className="md:pl-72"><div className="mx-auto max-w-7xl p-4 md:p-8"><Outlet /></div></main>
  </div>
}
