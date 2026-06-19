import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function DashboardPage(){
  const { user } = useAuth();
  const { data } = useQuery({ queryKey:['dashboard'], queryFn: async()=> (await api.get('/dashboard')).data });
  return <div className="space-y-6"><div><p className="text-slate-400">Good to see you,</p><h1 className="text-3xl font-bold">{user?.name} 👋</h1></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Projects" value={data?.stats.projectCount ?? 0}/><Stat label="Generated Content" value={data?.stats.generatedCount ?? 0}/><Stat label="Academic Field" value="CS"/><Stat label="AI Mode" value="Ready"/></div>
    <section className="card"><h2 className="mb-4 text-xl font-semibold">Recent Projects</h2>{data?.recentProjects?.length ? data.recentProjects.map((p:any)=><div key={p.id} className="border-t border-white/10 py-3"><b>{p.title}</b><p className="text-sm text-slate-400">{p.description}</p></div>) : <p className="text-slate-400">No projects yet. Generate your first research idea.</p>}</section>
  </div>
}
function Stat({label,value}:{label:string;value:string|number}){return <div className="card"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>}
