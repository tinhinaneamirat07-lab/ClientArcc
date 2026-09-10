import { useState, useMemo } from "react";
import "./Tasks.css";

type Status = "Todo" | "In Progress" | "Review" | "Done";
type Priority = "Low" | "Medium" | "High";

interface Task {
  id: number;
  projectId: number;
  projectTitle: string;
  clientName: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  due: string;
  hours: number;
  tags: string[];
}

const projects = [
  { id: 101, title: "E-commerce Redesign", client: "Sarah Johnson" },
  { id: 102, title: "Fitness Mobile App", client: "Alex Martin" },
  { id: 103, title: "SaaS Dashboard", client: "David Chen" },
  { id: 104, title: "Brand Identity", client: "Emma Wilson" },
  { id: 105, title: "SEO Audit", client: "Priya Patel" },
];

const initial: Task[] = [
  { id: 1, projectId: 101, projectTitle: "E-commerce Redesign", clientName: "Sarah Johnson", title: "Design homepage", description: "Hero + product grid", status: "In Progress", priority: "High", due: "2026-09-18", hours: 8, tags: ["Design"] },
  { id: 2, projectId: 101, projectTitle: "E-commerce Redesign", clientName: "Sarah Johnson", title: "Checkout flow", description: "Payment + validation", status: "Todo", priority: "High", due: "2026-09-25", hours: 12, tags: ["UX"] },
  { id: 3, projectId: 102, projectTitle: "Fitness Mobile App", clientName: "Alex Martin", title: "Store submission", description: "iOS review notes", status: "Review", priority: "Medium", due: "2026-09-28", hours: 3, tags: ["Mobile"] },
  { id: 4, projectId: 103, projectTitle: "SaaS Dashboard", clientName: "David Chen", title: "Write spec", description: "API + charts spec", status: "Todo", priority: "High", due: "2026-09-20", hours: 6, tags: ["Spec"] },
  { id: 5, projectId: 105, projectTitle: "SEO Audit", clientName: "Priya Patel", title: "Crawl site", description: "Screaming Frog", status: "Done", priority: "Low", due: "2026-09-10", hours: 2, tags: ["SEO"] },
  { id: 6, projectId: 104, projectTitle: "Brand Identity", clientName: "Emma Wilson", title: "Logo refinement", description: "Final palette", status: "Done", priority: "Low", due: "2026-08-18", hours: 4, tags: ["Branding"] },
];

const statuses: Status[] = ["Todo", "In Progress", "Review", "Done"];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try { const s = localStorage.getItem("fh_tasks"); return s ? JSON.parse(s) as Task[] : initial; } catch { return initial; }
  });
  const [view, setView] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [projectF, setProjectF] = useState("All");
  const [statusF, setStatusF] = useState<Status | "All">("All");
  const [priorityF, setPriorityF] = useState<Priority | "All">("All");
  const [modal, setModal] = useState<null | "add" | Task>(null);
  const [form, setForm] = useState<Omit<Task, "id">>({
    projectId: 101, projectTitle: "E-commerce Redesign", clientName: "Sarah Johnson",
    title: "", description: "", status: "Todo", priority: "Medium", due: new Date().toISOString().slice(0, 10), hours: 4, tags: []
  });
  const [tagInput, setTagInput] = useState("");

  function persist(next: Task[]) { setTasks(next); localStorage.setItem("fh_tasks", JSON.stringify(next)); }

  const filtered = useMemo(() => tasks.filter(t => {
    if (projectF !== "All" && String(t.projectId) !== projectF) return false;
    if (statusF !== "All" && t.status !== statusF) return false;
    if (priorityF !== "All" && t.priority !== priorityF) return false;
    if (search) {
      const q = search.toLowerCase();
      return [t.title, t.description, t.projectTitle, t.clientName, t.tags.join(" ")].join(" ").toLowerCase().includes(q);
    }
    return true;
  }), [tasks, search, projectF, statusF, priorityF]);

  const counts = useMemo(() => ({
    todo: tasks.filter(t => t.status === "Todo").length,
    prog: tasks.filter(t => t.status === "In Progress").length,
    review: tasks.filter(t => t.status === "Review").length,
    done: tasks.filter(t => t.status === "Done").length,
  }), [tasks]);

  function openAdd() {
    const p = projects[0];
    setForm({ projectId: p.id, projectTitle: p.title, clientName: p.client, title: "", description: "", status: (localStorage.getItem("fh_defaultStatus") as Status) || "Todo", priority: (localStorage.getItem("fh_defaultPriority") as Priority) || "Medium", due: new Date().toISOString().slice(0, 10), hours: 4, tags: [] });
    setModal("add");
  }
  function openEdit(t: Task) { const { id, ...rest } = t; setForm(rest); setModal(t); }
  function submit(e: React.FormEvent) {
    e.preventDefault(); if (!form.title.trim()) return;
    const proj = projects.find(p => p.id === form.projectId)!;
    const payload = { ...form, projectTitle: proj.title, clientName: proj.client, title: form.title.trim() };
    if (modal !== "add" && modal !== null) {
      const next = tasks.map(x => x.id === (modal as Task).id ? { ...x, ...payload } : x);
      persist(next);
    } else {
      persist([...tasks, { id: Date.now(), ...payload }]);
    }
    setModal(null);
  }
  function move(id: number, status: Status) { persist(tasks.map(t => t.id === id ? { ...t, status } : t)); }
  function remove(id: number) { if (confirm("Delete task?")) persist(tasks.filter(t => t.id !== id)); }

  const up = (k: keyof typeof form, v: any) => setForm(s => ({ ...s, [k]: v }));

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div><h1>Tasks</h1><p>Track deliverables per project — drag between stages</p></div>
        <div className="header-actions">
          <div className="view-toggle"><button className={view === "board" ? "active" : ""} onClick={() => setView("board")}>Board</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button></div>
          <button className="add-client-button" onClick={openAdd}>+ New Task</button>
        </div>
      </div>

      <div className="tasks-stats">
        <span className="chip">Todo {counts.todo}</span><span className="chip prog">In Progress {counts.prog}</span><span className="chip rev">Review {counts.review}</span><span className="chip done">Done {counts.done}</span>
      </div>

      <div className="toolbar">
        <input className="search" placeholder="Search task, project, client..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={projectF} onChange={e => setProjectF(e.target.value)}><option value="All">All Projects</option>{projects.map(p => <option key={p.id} value={String(p.id)}>{p.title}</option>)}</select>
        <select value={statusF} onChange={e => setStatusF(e.target.value as any)}><option value="All">All Statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</select>
        <select value={priorityF} onChange={e => setPriorityF(e.target.value as any)}><option value="All">All Priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
      </div>

      {view === "board" ? (
        <div className="kanban">
          {statuses.map(col => {
            const colTasks = filtered.filter(t => t.status === col);
            return (
              <div key={col} className="kanban-col" onDragOver={e => e.preventDefault()} onDrop={e => { const id = Number(e.dataTransfer.getData("text/plain")); if (id) move(id, col); }}>
                <div className="kanban-head"><h3>{col}</h3><span>{colTasks.length}</span></div>
                <div className="kanban-list">
                  {colTasks.map(t => (
                    <div key={t.id} className="task-card" draggable onDragStart={e => e.dataTransfer.setData("text/plain", String(t.id))}>
                      <div className="task-top"><span className={`priority priority-${t.priority.toLowerCase()}`}>{t.priority}</span><span className="due">📅 {t.due}</span></div>
                      <h4>{t.title}</h4>
                      <small>{t.projectTitle} • {t.clientName}</small>
                      <p className="desc">{t.description}</p>
                      <div className="meta-row small"><span>⏱ {t.hours}h</span>{t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                      <div className="task-actions">
                        <select value={t.status} onClick={e => e.stopPropagation()} onChange={e => move(t.id, e.target.value as Status)}>{statuses.map(s => <option key={s}>{s}</option>)}</select>
                        <button className="icon-button" onClick={() => openEdit(t)}>✏️</button>
                        <button className="icon-button" onClick={() => remove(t.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="list-table">
          <div className="list-head"><span>Task</span><span>Project</span><span>Priority</span><span>Due</span><span>Status</span><span></span></div>
          {filtered.map(t => (
            <div key={t.id} className="list-row">
              <strong>{t.title}</strong><span>{t.projectTitle}</span><span className={`priority priority-${t.priority.toLowerCase()}`}>{t.priority}</span><span>{t.due}</span>
              <select value={t.status} onChange={e => move(t.id, e.target.value as Status)}>{statuses.map(s => <option key={s}>{s}</option>)}</select>
              <span className="row-actions"><button className="icon-button" onClick={() => openEdit(t)}>✏️</button><button className="icon-button" onClick={() => remove(t.id)}>🗑️</button></span>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && <div className="empty-state">No tasks match filters.</div>}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === "add" ? "New Task" : "Edit Task"}</h2>
            <form onSubmit={submit} className="form-grid">
              <label className="full">Title*<input value={form.title} onChange={e => up("title", e.target.value)} required placeholder="Design homepage" autoFocus /></label>
              <label className="full">Description<textarea value={form.description} onChange={e => up("description", e.target.value)} rows={2} placeholder="Details..." /></label>
              <label>Project<select value={String(form.projectId)} onChange={e => up("projectId", Number(e.target.value))}>{projects.map(p => <option key={p.id} value={String(p.id)}>{p.title} — {p.client}</option>)}</select></label>
              <label>Status<select value={form.status} onChange={e => up("status", e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
              <label>Priority<select value={form.priority} onChange={e => up("priority", e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
              <label>Due<input type="date" value={form.due} onChange={e => up("due", e.target.value)} /></label>
              <label>Hours<input type="number" min={1} value={form.hours} onChange={e => up("hours", Number(e.target.value))} /></label>
              <label className="full">Tags + Enter<input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) { up("tags", [...form.tags, tagInput.trim()]); setTagInput(""); } } }} placeholder="Design, SEO" />{form.tags.length > 0 && <div className="tags">{form.tags.map(tag => <span key={tag} className="tag" onClick={() => up("tags", form.tags.filter(x => x !== tag))}>{tag} ×</span>)}</div>}</label>
              <div className="modal-actions full"><button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="btn-primary">{modal === "add" ? "Create" : "Save"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
