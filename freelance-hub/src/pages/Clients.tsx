import { useState, useMemo, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./Clients.css";

type Status = "Lead" | "Proposal" | "Active" | "Review" | "Completed" | "Archived";
type PaymentStatus = "Paid" | "Pending" | "Overdue";
type Priority = "Low" | "Medium" | "High";
type Category = "Web Design" | "Mobile App" | "Branding" | "Consulting" | "Development";
type RateType = "fixed" | "hourly";

interface FreelanceClient {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  project: string;
  category: Category;
  status: Status;
  paymentStatus: PaymentStatus;
  budget: number;
  rateType: RateType;
  hourlyRate?: number;
  currency: string;
  deadline: string;
  priority: Priority;
  progress: number;
  rating: number;
  tags: string[];
  notes: string;
  startedAt: string;
  lastContactAt: string;
}

type DbRow = Record<string, any>;
function toClient(r: DbRow): FreelanceClient {
  return {
    id: r.id, name: r.name, company: r.company ?? "", email: r.email ?? "",
    phone: r.phone ?? "", avatar: r.avatar ?? r.name?.slice(0,2).toUpperCase() ?? "NA",
    project: r.project ?? "", category: r.category ?? "Web Design",
    status: r.status ?? "Lead", paymentStatus: r.payment_status ?? "Pending",
    budget: r.budget ?? 0, rateType: r.rate_type ?? "fixed", hourlyRate: r.hourly_rate ?? 0,
    currency: r.currency ?? "$", deadline: r.deadline ? String(r.deadline).slice(0,10) : "",
    priority: r.priority ?? "Medium", progress: r.progress ?? 0, rating: r.rating ?? 5,
    tags: r.tags ?? [], notes: r.notes ?? "",
    startedAt: r.started_at ? String(r.started_at).slice(0,10) : "",
    lastContactAt: r.last_contact_at ? String(r.last_contact_at).slice(0,10) : "",
  };
}
// only columns that exist in your current DB — extra fields kept local-only if column missing
function toRow(c: Omit<FreelanceClient,"id">) {
  return {
    name: c.name, company: c.company, email: c.email, phone: c.phone, avatar: c.avatar,
    project: c.project, category: c.category, status: c.status, payment_status: c.paymentStatus,
    budget: c.budget, rate_type: c.rateType, currency: c.currency, deadline: c.deadline || null,
    priority: c.priority, progress: c.progress, rating: c.rating, tags: c.tags, notes: c.notes,
  };
}

const initialClients: FreelanceClient[] = [
  { id: 1, name: "Sarah Johnson", company: "Acme Co", email: "sarah@acme.co", phone: "+1 555 0101", avatar: "SJ", project: "E-commerce Redesign", category: "Web Design", status: "Active", paymentStatus: "Pending", budget: 4500, rateType: "fixed", currency: "$", deadline: "2026-10-15", priority: "High", progress: 65, rating: 5, tags: ["VIP","Retainer"], notes: "Weekly check-in Tuesdays", startedAt: "2026-08-01", lastContactAt: "2026-09-05" },
  { id: 2, name: "Alex Martin", company: "Bolt Labs", email: "alex@boltlabs.io", phone: "+1 555 0102", avatar: "AM", project: "Fitness Mobile App", category: "Mobile App", status: "Review", paymentStatus: "Paid", budget: 8200, rateType: "fixed", currency: "$", deadline: "2026-09-30", priority: "Medium", progress: 90, rating: 4, tags: ["Mobile"], notes: "Awaiting store review", startedAt: "2026-06-15", lastContactAt: "2026-09-08" },
  { id: 3, name: "Emma Wilson", company: "Wilson Studio", email: "emma@wilson.studio", phone: "+1 555 0103", avatar: "EW", project: "Brand Identity", category: "Branding", status: "Completed", paymentStatus: "Paid", budget: 3200, rateType: "fixed", currency: "$", deadline: "2026-08-20", priority: "Low", progress: 100, rating: 5, tags: ["Branding"], notes: "Testimonial received", startedAt: "2026-07-01", lastContactAt: "2026-08-22" },
];

type ModalMode = "add" | "edit" | null;

export default function Clients() {
  const [clients, setClients] = useState<FreelanceClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FreelanceClient | null>(null);
  const [detail, setDetail] = useState<FreelanceClient | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [sortBy, setSortBy] = useState<"deadline" | "budget" | "rating">("deadline");
  const [form, setForm] = useState<Omit<FreelanceClient,"id">>({
    name:"", company:"", email:"", phone:"", avatar:"", project:"", category:"Web Design",
    status:"Lead", paymentStatus:"Pending", budget: 0, rateType:"fixed", hourlyRate: 0,
    currency:"$", deadline:"", priority:"Medium", progress:0, rating:5, tags:[], notes:"",
    startedAt: new Date().toISOString().slice(0,10), lastContactAt: new Date().toISOString().slice(0,10)
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    supabase.from("clients").select("*").order("id",{ascending:false}).then(({ data, error }: { data: any; error: any }) => {
      if (error) {
        console.error("Supabase load error:", (error as any).message);
        setClients(initialClients);
      } else if (data && data.length>0) {
        setClients((data as any[]).map(toClient));
      } else {
        setClients(initialClients);
      }
      setLoading(false);
    });
  }, []);

  const stats = useMemo(()=> ({
    totalBudget: clients.reduce((s,c)=>s+c.budget,0),
    pending: clients.filter(c=>c.paymentStatus==="Pending").length,
    overdue: clients.filter(c=>c.paymentStatus==="Overdue").length,
    active: clients.filter(c=>c.status==="Active").length,
  }),[clients]);

  const filtered = useMemo(()=>{
    let out = clients.filter(c=>{
      if(statusFilter!=="All" && c.status!==statusFilter) return false;
      if(paymentFilter!=="All" && c.paymentStatus!==paymentFilter) return false;
      if(priorityFilter!=="All" && c.priority!==priorityFilter) return false;
      if(categoryFilter!=="All" && c.category!==categoryFilter) return false;
      if(search){
        const q=search.toLowerCase();
        return [c.name,c.company,c.email,c.project,c.tags.join(" ")].join(" ").toLowerCase().includes(q);
      }
      return true;
    });
    out = [...out].sort((a,b)=>{
      if(sortBy==="budget") return b.budget-a.budget;
      if(sortBy==="rating") return b.rating-a.rating;
      return new Date(a.deadline).getTime()-new Date(b.deadline).getTime();
    });
    return out;
  },[clients, search, statusFilter, paymentFilter, priorityFilter, categoryFilter, sortBy]);

  function openAdd(){
    setForm({ name:"", company:"", email:"", phone:"", avatar:"", project:"", category:"Web Design", status:"Lead", paymentStatus:"Pending", budget:0, rateType:"fixed", hourlyRate:0, currency:"$", deadline:"", priority:"Medium", progress:0, rating:5, tags:[], notes:"", startedAt: new Date().toISOString().slice(0,10), lastContactAt: new Date().toISOString().slice(0,10) });
    setModalMode("add"); setEditingId(null);
  }
  function openEdit(c: FreelanceClient){ const {id, ...rest}=c; setForm(rest); setEditingId(id); setModalMode("edit"); }
  function closeModal(){ setModalMode(null); setEditingId(null); }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!form.name.trim() || !form.project.trim() || !form.email.trim()) return;
    const cleaned = { ...form, name: form.name.trim(), project: form.project.trim(), avatar: form.avatar || form.name.slice(0,2).toUpperCase() };
    const payload = toRow(cleaned);
    if(modalMode==="edit" && editingId!==null){
      const { data, error } = await supabase.from("clients").update(payload).eq("id", editingId).select().single();
      if(error){ console.error(error.message); setClients(prev=>prev.map(c=> c.id===editingId ? { ...c, ...cleaned, id: editingId } : c)); }
      else if(data) setClients(prev=>prev.map(c=> c.id===editingId ? toClient(data) : c));
    } else {
      const { data, error } = await supabase.from("clients").insert(payload).select().single();
      if(error){ console.error(error.message); setClients(prev=>[{ id: Date.now(), ...cleaned }, ...prev]); }
      else if(data) setClients(prev=>[toClient(data), ...prev]);
    }
    closeModal();
  }
  async function handleDelete(){
    if(!deleteTarget) return;
    const { error } = await supabase.from("clients").delete().eq("id", deleteTarget.id);
    if(error) console.error(error.message);
    setClients(p=>p.filter(c=>c.id!==deleteTarget.id));
    setDeleteTarget(null);
  }
  const up = (k: keyof typeof form, v: any)=> setForm(s=>({...s,[k]:v}));

  if(loading) return <div className="empty-state"><p>Loading clients...</p></div>;

  return (
    <div className="clients-page">
      <div className="page-header">
        <div><h1>Freelance Clients</h1><p>Manage pipeline, budgets & payments</p></div>
        <button className="add-client-button" onClick={openAdd}>+ New Client</button>
      </div>
      <div className="freelance-stats">
        <div className="stat-card"><span>Total Budget</span><strong>${stats.totalBudget.toLocaleString()}</strong></div>
        <div className="stat-card"><span>Active</span><strong>{stats.active}</strong></div>
        <div className="stat-card warn"><span>Pending Invoices</span><strong>{stats.pending}</strong></div>
        <div className="stat-card danger"><span>Overdue</span><strong>{stats.overdue}</strong></div>
      </div>
      <div className="toolbar">
        <input className="search" placeholder="Search name, company, project, tags..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}><option value="All">All Statuses</option><option>Lead</option><option>Proposal</option><option>Active</option><option>Review</option><option>Completed</option><option>Archived</option></select>
        <select value={paymentFilter} onChange={e=>setPaymentFilter(e.target.value as any)}><option value="All">All Payments</option><option>Paid</option><option>Pending</option><option>Overdue</option></select>
        <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value as any)}><option value="All">All Priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
        <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value as any)}><option value="All">All Categories</option><option>Web Design</option><option>Mobile App</option><option>Branding</option><option>Consulting</option><option>Development</option></select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)}><option value="deadline">Sort: Deadline</option><option value="budget">Sort: Budget</option><option value="rating">Sort: Rating</option></select>
      </div>
      <div className="clients-grid">
        {filtered.map(c=> (
          <div className="client-card" key={c.id} onClick={()=>setDetail(c)}>
            <div className="client-card-actions" onClick={e=>e.stopPropagation()}>
              <button className="icon-button" aria-label="Edit" onClick={()=>openEdit(c)}>✏️</button>
              <button className="icon-button" aria-label="Delete" onClick={()=>setDeleteTarget(c)}>🗑️</button>
            </div>
            <div className="card-top">
              <div className="avatar">{c.avatar}</div>
              <div><h3>{c.name}</h3><small>{c.company} • {c.category}</small></div>
              <span className={`priority priority-${c.priority.toLowerCase()}`}>{c.priority}</span>
            </div>
            <p className="project-title">{c.project}</p>
            <div className="progress-wrap"><div className="progress-bar" style={{width:`${c.progress}%`}} /><span>{c.progress}%</span></div>
            <div className="meta-row">
              <span className={`status status-${c.status.toLowerCase()}`}>{c.status}</span>
              <span className={`pay pay-${c.paymentStatus.toLowerCase()}`}>{c.paymentStatus}</span>
              <span className="budget">{c.currency}{c.budget.toLocaleString()} {c.rateType==="hourly" && `($${c.hourlyRate}/h)`}</span>
            </div>
            <div className="meta-row small"><span>📅 {c.deadline || "—"}</span><span>⭐ {c.rating}/5</span><span>✉️ {c.email}</span></div>
            {c.tags.length>0 && <div className="tags">{c.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>}
          </div>
        ))}
      </div>
      {filtered.length===0 && <div className="empty-state"><p>No clients match filters.</p></div>}
      {modalMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal large" onClick={e=>e.stopPropagation()}>
            <h2>{modalMode==="edit" ? "Edit Freelance Client" : "New Freelance Client"}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <label>Name*<input value={form.name} onChange={e=>up("name",e.target.value)} required /></label>
              <label>Company<input value={form.company} onChange={e=>up("company",e.target.value)} /></label>
              <label>Email*<input type="email" value={form.email} onChange={e=>up("email",e.target.value)} required /></label>
              <label>Phone<input value={form.phone} onChange={e=>up("phone",e.target.value)} /></label>
              <label>Project*<input value={form.project} onChange={e=>up("project",e.target.value)} required /></label>
              <label>Category<select value={form.category} onChange={e=>up("category",e.target.value)}><option>Web Design</option><option>Mobile App</option><option>Branding</option><option>Consulting</option><option>Development</option></select></label>
              <label>Budget<input type="number" value={form.budget} onChange={e=>up("budget",Number(e.target.value))} /></label>
              <label>Rate Type<select value={form.rateType} onChange={e=>up("rateType",e.target.value)}><option value="fixed">Fixed</option><option value="hourly">Hourly</option></select></label>
              {form.rateType==="hourly" && <label>Hourly Rate<input type="number" value={form.hourlyRate} onChange={e=>up("hourlyRate",Number(e.target.value))} /></label>}
              <label>Status<select value={form.status} onChange={e=>up("status",e.target.value)}><option>Lead</option><option>Proposal</option><option>Active</option><option>Review</option><option>Completed</option><option>Archived</option></select></label>
              <label>Payment<select value={form.paymentStatus} onChange={e=>up("paymentStatus",e.target.value)}><option>Paid</option><option>Pending</option><option>Overdue</option></select></label>
              <label>Priority<select value={form.priority} onChange={e=>up("priority",e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
              <label>Deadline<input type="date" value={form.deadline} onChange={e=>up("deadline",e.target.value)} /></label>
              <label>Progress {form.progress}%<input type="range" min={0} max={100} value={form.progress} onChange={e=>up("progress",Number(e.target.value))} /></label>
              <label>Rating<select value={form.rating} onChange={e=>up("rating",Number(e.target.value))}><option value={5}>★★★★★ (5)</option><option value={4}>★★★★ (4)</option><option value={3}>★★★ (3)</option><option value={2}>★★ (2)</option><option value={1}>★ (1)</option></select></label>
              <label className="full">Tags + Enter<input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); if(tagInput.trim()){ up("tags",[...form.tags, tagInput.trim()]); setTagInput(""); }}}} /></label>
              <label className="full">Notes<textarea value={form.notes} onChange={e=>up("notes",e.target.value)} rows={3} /></label>
              <div className="modal-actions full"><button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="btn-primary">{modalMode==="edit"?"Save Changes":"Create Client"}</button></div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="modal-overlay" onClick={()=>setDeleteTarget(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h2>Delete {deleteTarget.name}?</h2><p>This will remove <strong>{deleteTarget.project}</strong>.</p>
            <div className="modal-actions"><button className="btn-secondary" onClick={()=>setDeleteTarget(null)}>Cancel</button><button className="btn-danger" onClick={handleDelete}>Delete</button></div>
          </div>
        </div>
      )}
      {detail && (
        <div className="modal-overlay" onClick={()=>setDetail(null)}>
          <div className="modal large" onClick={e=>e.stopPropagation()}>
            <h2>{detail.name} — {detail.project}</h2>
            <p>{detail.company} • {detail.email} • {detail.phone}</p>
            <div className="detail-grid">
              <div><strong>Budget:</strong> {detail.currency}{detail.budget.toLocaleString()} ({detail.rateType})</div>
              <div><strong>Deadline:</strong> {detail.deadline}</div>
              <div><strong>Started:</strong> {detail.startedAt}</div>
              <div><strong>Last contact:</strong> {detail.lastContactAt}</div>
              <div><strong>Category:</strong> {detail.category}</div>
              <div><strong>Progress:</strong> {`${detail.progress}%`}</div>
            </div>
            <p style={{marginTop:12}}>{detail.notes}</p>
            <div className="modal-actions">
              <a className="btn-secondary" href={`mailto:${detail.email}`}>✉️ Email</a>
              <button className="btn-primary" onClick={()=>{setDetail(null); openEdit(detail);}}>Edit</button>
              <button className="btn-secondary" onClick={()=>setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
