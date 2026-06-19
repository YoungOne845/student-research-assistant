import { FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Project } from '../types';

export function ProjectsPage(){
  const qc=useQueryClient(); const {data}=useQuery({queryKey:['projects'],queryFn:async()=> (await api.get('/projects')).data.projects as Project[]});
  const create=useMutation({mutationFn:async(form:FormData)=>api.post('/projects',{academicFieldSlug:'computer-science',title:String(form.get('title')),description:String(form.get('description')),tags:String(form.get('tags')||'').split(',').map(s=>s.trim()).filter(Boolean)}),onSuccess:()=>qc.invalidateQueries({queryKey:['projects']})});
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault(); create.mutate(new FormData(e.currentTarget)); e.currentTarget.reset();}
  return <div className="space-y-6"><h1 className="text-3xl font-bold">Projects</h1><form onSubmit={submit} className="card grid gap-3 md:grid-cols-3"><input className="input" name="title" placeholder="Project title"/><input className="input" name="description" placeholder="Short description"/><input className="input" name="tags" placeholder="tags, comma, separated"/><button className="btn md:col-span-3">Save Project</button></form><div className="grid gap-4 md:grid-cols-2">{data?.map(p=><div className="card" key={p.id}><h2 className="text-xl font-semibold">{p.title}</h2><p className="mt-2 text-slate-400">{p.description}</p><div className="mt-4 flex flex-wrap gap-2">{p.tags.map(t=><span className="rounded-full bg-white/10 px-3 py-1 text-xs" key={t}>{t}</span>)}</div></div>)}</div></div>
}
