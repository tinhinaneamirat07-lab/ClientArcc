import { useState, useMemo } from "react";
import "./Projects.css";

type Status = "Planning" | "In Progress" | "Review" | "Completed" | "On Hold";
type Priority = "Low" | "Medium" | "High";
type Category = "Web Design" | "Mobile App" | "Branding" | "Consulting" | "Development";

interface Milestone { id: number; title: string; done: boolean; due: string; }
interface Project {
  id: number; clientId: number; clientName: string;
  title: string; description: string; category: Category;
  status: Status; priority: Priority; progress: number;
  budget: number; currency: string; rateType: "fixed"|"hourly";
  startDate: string; deadline: string; estimatedHours: number;
  tags: string[]; milestones: Milestone[];
}

const clients = [
  { id: 1, name: "Sarah Johnson" }, { id: 2, name: "Alex Martin" },
  { id: 3, name: "Emma Wilson" }, { id: 4, name: "David Chen" }, { id: 5, name: "Priya Patel" },
];

const initial: Project[] = [
  { id:101, clientId:1, clientName:"Sarah Johnson", title:"E-commerce Redesign", description:"Shopify store redesign + checkout", category:"Web Design", status:"In Progress", priority:"High", progress:65, budget:4500, currency:"$", rateType:"fixed", startDate:"2026-08-01", deadline:"2026-10-15", estimatedHours:120, tags:["Shopify","VIP"], milestones:[{id:1,title:"Wireframes",done:true,due:"2026-08-15"},{id:2,title:"Homepage",done:true,due:"2026-09-01"},{id:3,title:"Checkout",done:false,due:"2026-09-25"},{id:4,title:"QA",done:false,due:"2026-10-10"}] },
  { id:102, clientId:2, clientName:"Alex Martin", title:"Fitness Mobile App", description:"React Native iOS + Android", category:"Mobile App", status:"Review", priority:"Medium", progress:90, budget:8200, currency:"$", rateType:"fixed", startDate:"2026-06-15", deadline:"2026-09-30", estimatedHours:240, tags:["React Native"], milestones:[{id:1,title:"MVP",done:true,due:"2026-08-01"},{id:2,title:"Store submission",done:false,due:"2026-09-28"}] },
  { id:103, clientId:4, clientName:"David Chen", title:"SaaS Dashboard", description:"Analytics dashboard + API", category:"Development", status:"Planning", priority:"High", progress:10, budget:12000, currency:"$", rateType:"hourly", startDate:"2026-09-10", deadline:"2026-12-01", estimatedHours:300, tags:["SaaS"], milestones:[{id:1,title:"Spec",done:false,due:"2026-09-20"}] },
  { id:104, clientId:3, clientName:"Emma Wilson", title:"Brand Identity", description:"Logo + guidelines", category:"Branding", status:"Completed", priority:"Low", progress:100, budget:3200, currency:"$", rateType:"fixed", startDate:"2026-07-01", deadline:"2026-08-20", estimatedHours:60, tags:["Branding"], milestones:[{id:1,title:"Logo",done:true,due:"2026-07-20"},{id:2,title:"Guidelines",done:true,due:"2026-08-18"}] },
  { id:105, clientId:5, clientName:"Priya Patel", title:"SEO Audit", description:"Technical SEO + report", category:"Consulting", status:"On Hold", priority:"High", progress:0, budget:1500, currency:"$", rateType:"fixed", startDate:"2026-08-20", deadline:"2026-09-12", estimatedHours:20, tags:["SEO"], milestones:[{id:1,title:"Crawl",done:false,due:"2026-09-10"}] },
];

const statuses: Status[] = ["Planning","In Progress","Review","Completed","On Hold"];

export default function Projects(){
  const [projects,setProjects]=useState<Project[]>(initial);
  const [view,setView]=useState<"grid"|"kanban"|"list">("kanban");
  const [search,setSearch]=useState("");
  const [clientF,setClientF]=useState("All");
  const [statusF,setStatusF]=useState<Status|"All">("All");
  const [priorityF,setPriorityF]=useState<Priority|"All">("All");
  const [modal,setModal]=useState<null|"add"|Project>(null);
  const [detail,setDetail]=useState<Project|null>(null);
  const [form,setForm]=useState<Omit<Project,"id">>({
    clientId:1, clientName:"Sarah Johnson", title:"", description:"", category:"Web Design",
    status:"Planning", priority:"Medium", progress:0, budget:0, currency:"$", rateType:"fixed",
    startDate:new Date().toISOString().slice(0,10), deadline:"", estimatedHours:40, tags:[], milestones:[]
  });

  const filtered = useMemo(()=>{
    return projects.filter(p=>{
      if(clientF!=="All" && String(p.clientId)!==clientF) return false;
      if(statusF!=="All" && p.status!==statusF) return false;
      if(priorityF!=="All" && p.priority!==priorityF) return false;
      if(search){
        const q=search.toLowerCase();
        return [p.title,p.description,p.clientName,p.tags.join(" ")].join(" ").toLowerCase().includes(q);
      }
      return true;
    });
  },[projects,search,clientF,statusF,priorityF]);

  function openAdd(){
    setForm({ clientId:1, clientName:"Sarah Johnson", title:"", description:"", category:"Web Design", status:"Planning", priority:"Medium", progress:0, budget:0, currency:"$", rateType:"fixed", startDate:new Date().toISOString().slice(0,10), deadline:"", estimatedHours:40, tags:[], milestones:[] });
    setModal("add");
  }
  function openEdit(p:Project){ const {id,...rest}=p; setForm(rest); setModal(p); }
  function submit(e:React.FormEvent){
    e.preventDefault(); if(!form.title.trim()) return;
    const clientName = clients.find(c=>c.id===form.clientId)?.name || form.clientName;
    if(modal!=="add" && modal!==null && typeof modal!=="string"){
      setProjects(prev=>prev.map(x=> x.id===(modal as Project).id ? {...x, ...form, clientName, title: form.title.trim()} : x));
    } else {
      setProjects(prev=>[...prev, {id:Date.now(), ...form, clientName, title: form.title.trim()}]);
    }
    setModal(null);
  }
  function move(id:number, status:Status){ setProjects(prev=>prev.map(p=> p.id===id ? {...p, status, progress: status==="Completed"?100: status==="Planning"?10:p.progress} : p)); }

  const up = (k:keyof typeof form, v:any)=> setForm(s=>({...s,[k]:v}));

  return (
    <div className="projects-page">
      <div className="page-header">
        <div><h1>Projects</h1><p>Kanban workflow — linked to clients</p></div>
        <div className="header-actions">
          <div className="view-toggle">
            <button className={view==="kanban"?"active":""} onClick={()=>setView("kanban")}>Kanban</button>
            <button className={view==="grid"?"active":""} onClick={()=>setView("grid")}>Grid</button>
            <button className={view==="list"?"active":""} onClick={()=>setView("list")}>List</button>
          </div>
          <button className="add-client-button" onClick={openAdd}>+ New Project</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="search" placeholder="Search project, client, tags..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={clientF} onChange={e=>setClientF(e.target.value)}><option value="All">All Clients</option>{clients.map(c=><option key={c.id} value={String(c.id)}>{c.name}</option>)}</select>
        <select value={statusF} onChange={e=>setStatusF(e.target.value as any)}><option value="All">All Statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
        <select value={priorityF} onChange={e=>setPriorityF(e.target.value as any)}><option value="All">All Priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
      </div>

      {view==="kanban" && (
        <div className="kanban">
          {statuses.map(col=>{
            const colItems = filtered.filter(p=>p.status===col);
            return (
              <div key={col} className="kanban-col" onDragOver={e=>e.preventDefault()} onDrop={e=>{ const id=Number(e.dataTransfer.getData("text/plain")); if(id) move(id,col); }}>
                <div className="kanban-head"><h3>{col}</h3><span>{colItems.length}</span></div>
                <div className="kanban-list">
                  {colItems.map(p=> (
                    <div key={p.id} className="project-card" draggable onDragStart={e=>e.dataTransfer.setData("text/plain",String(p.id))} onClick={()=>setDetail(p)}>
                      <div className="card-actions" onClick={e=>e.stopPropagation()}>
                        <button className="icon-button" onClick={()=>openEdit(p)}>✏️</button>
                        <button className="icon-button" onClick={()=>setProjects(prev=>prev.filter(x=>x.id!==p.id))}>🗑️</button>
                      </div>
                      <span className={`priority priority-${p.priority.toLowerCase()}`}>{p.priority}</span>
                      <h4>{p.title}</h4>
                      <small>{p.clientName} • {p.category}</small>
                      <p className="desc">{p.description}</p>
                      <div className="progress-wrap"><div className="progress-bar" style={{width:`${p.progress}%`}}/><span>{p.progress}%</span></div>
                      <div className="meta-row small"><span>📅 {p.deadline||"—"}</span><span>{p.currency}{p.budget.toLocaleString()}</span><span>{p.milestones.filter(m=>m.done).length}/{p.milestones.length} milestones</span></div>
                      {p.tags.length>0 && <div className="tags">{p.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>}
                      <select className="mini-select" value={p.status} onClick={e=>e.stopPropagation()} onChange={e=>move(p.id, e.target.value as Status)}>{statuses.map(s=><option key={s}>{s}</option>)}</select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view==="grid" && (
        <div className="projects-grid">
          {filtered.map(p=>(
            <div key={p.id} className="project-card" onClick={()=>setDetail(p)}>
              <h4>{p.title}</h4><small>{p.clientName}</small>
              <span className={`status status-${p.status.toLowerCase().replace(" ","-")}`}>{p.status}</span>
              <div className="progress-wrap"><div className="progress-bar" style={{width:`${p.progress}%`}}/><span>{p.progress}%</span></div>
            </div>
          ))}
        </div>
      )}

      {view==="list" && (
        <div className="list-table">
          <div className="list-head"><span>Project</span><span>Client</span><span>Status</span><span>Deadline</span><span>Budget</span></div>
          {filtered.map(p=>(
            <div key={p.id} className="list-row" onClick={()=>setDetail(p)}>
              <strong>{p.title}</strong><span>{p.clientName}</span><span className={`status status-${p.status.toLowerCase().replace(" ","-")}`}>{p.status}</span><span>{p.deadline}</span><span>{p.currency}{p.budget.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {filtered.length===0 && <div className="empty-state">No projects match filters.</div>}

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal large" onClick={e=>e.stopPropagation()}>
            <h2>{modal==="add" ? "New Project" : "Edit Project"}</h2>
            <form onSubmit={submit} className="form-grid">
              <label className="full">Title*<input value={form.title} onChange={e=>up("title",e.target.value)} required /></label>
              <label className="full">Description<textarea value={form.description} onChange={e=>up("description",e.target.value)} rows={2} /></label>
              <label>Client<select value={String(form.clientId)} onChange={e=>up("clientId",Number(e.target.value))}>{clients.map(c=><option key={c.id} value={String(c.id)}>{c.name}</option>)}</select></label>
              <label>Category<select value={form.category} onChange={e=>up("category",e.target.value)}><option>Web Design</option><option>Mobile App</option><option>Branding</option><option>Consulting</option><option>Development</option></select></label>
              <label>Status<select value={form.status} onChange={e=>up("status",e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
              <label>Priority<select value={form.priority} onChange={e=>up("priority",e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
              <label>Budget<input type="number" value={form.budget} onChange={e=>up("budget",Number(e.target.value))} /></label>
              <label>Deadline<input type="date" value={form.deadline} onChange={e=>up("deadline",e.target.value)} /></label>
              <label>Progress {form.progress}%<input type="range" min={0} max={100} value={form.progress} onChange={e=>up("progress",Number(e.target.value))} /></label>
              <label>Hours<input type="number" value={form.estimatedHours} onChange={e=>up("estimatedHours",Number(e.target.value))} /></label>
              <div className="modal-actions full"><button type="button" className="btn-secondary" onClick={()=>setModal(null)}>Cancel</button><button type="submit" className="btn-primary">{modal==="add"?"Create":"Save"}</button></div>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="modal-overlay" onClick={()=>setDetail(null)}>
          <div className="modal large" onClick={e=>e.stopPropagation()}>
            <h2>{detail.title}</h2><p>{detail.clientName} • {detail.category} • {detail.currency}{detail.budget.toLocaleString()}</p>
            <p>{detail.description}</p>
            <div className="progress-wrap" style={{marginTop:12}}><div className="progress-bar" style={{width:`${detail.progress}%`}}/><span>{detail.progress}%</span></div>
            <h3 style={{marginTop:16}}>Milestones ({detail.milestones.filter(m=>m.done).length}/{detail.milestones.length})</h3>
            <ul>{detail.milestones.map(m=><li key={m.id} style={{textDecoration: m.done?"line-through":"none"}}>{m.title} — {m.due} {m.done?"✓":"○"}</li>)}</ul>
            <div className="modal-actions"><button className="btn-secondary" onClick={()=>setDetail(null)}>Close</button><button className="btn-primary" onClick={()=>{setDetail(null); openEdit(detail);}}>Edit</button></div>
          </div>
        </div>
      )}
    </div>
  );
}