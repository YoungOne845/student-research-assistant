import { FormEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { api } from '../lib/api';
import type { Module } from '../types';

export function ModulesPage(){
  const [selected,setSelected]=useState('project-idea-generator'); const [output,setOutput]=useState(''); const [loading,setLoading]=useState(false);
  const { data } = useQuery({ queryKey:['modules'], queryFn: async()=> (await api.get('/catalog/fields/computer-science/modules')).data.modules as Module[] });
  async function submit(e:FormEvent<HTMLFormElement>){ e.preventDefault(); setLoading(true); const fd=new FormData(e.currentTarget); const input={ topic:String(fd.get('topic')||''), context:String(fd.get('context')||''), constraints:String(fd.get('constraints')||'') }; try{ const r=await api.post('/ai/generate',{academicFieldSlug:'computer-science',researchModuleSlug:selected,input}); setOutput(r.data.generated.content); } finally{ setLoading(false); } }
  return <div className="grid gap-6 lg:grid-cols-[320px_1fr]"><aside className="card h-fit"><h1 className="mb-4 text-xl font-bold">Research Modules</h1><div className="space-y-2">{data?.map(m=><button key={m.slug} onClick={()=>setSelected(m.slug)} className={`w-full rounded-xl px-3 py-3 text-left text-sm ${selected===m.slug?'bg-brand-600':'bg-white/5 hover:bg-white/10'}`}><b>{m.name}</b><p className="text-xs text-slate-300">{m.description}</p></button>)}</div></aside><main className="space-y-6"><form onSubmit={submit} className="card space-y-4"><h2 className="text-2xl font-bold">Generate Research Content</h2><input className="input" name="topic" placeholder="Topic or area e.g. AI attendance system"/><textarea className="input min-h-28" name="context" placeholder="Describe your project idea, course requirements, or research problem"/><textarea className="input min-h-20" name="constraints" placeholder="Constraints e.g. solo developer, React + Supabase, 3 months"/><button disabled={loading} className="btn">{loading?'Generating...':'Generate'}</button></form>{output&&<article className="card prose prose-invert max-w-none"><ReactMarkdown>{output}</ReactMarkdown></article>}</main></div>
}
