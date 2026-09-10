import { Link } from "react-router-dom";
import "./Dashboard.css";

const kpis = [
  { label: "Total Revenue", value: "$28,400", trend: "+12.4%", trendUp: true, icon: "💰", sub: "vs last month" },
  { label: "Active Projects", value: "7", trend: "3 due", trendUp: null, icon: "🚀", sub: "this week" },
  { label: "Pending Invoices", value: "$6,000", trend: "3 invoices", trendUp: false, icon: "⏳", sub: "awaiting" },
  { label: "Overdue", value: "1", trend: "$1,500", trendUp: false, icon: "⚠️", sub: "Priya Patel" },
];

const revenue = [
  { m: "Apr", v: 4200 }, { m: "May", v: 6800 }, { m: "Jun", v: 5400 },
  { m: "Jul", v: 8200 }, { m: "Aug", v: 7100 }, { m: "Sep", v: 9400 },
];

const pipeline = [
  { label: "Lead", count: 4, color: "#94a3b8" },
  { label: "Proposal", count: 2, color: "#3b82f6" },
  { label: "Active", count: 7, color: "#14b8a6" },
  { label: "Review", count: 3, color: "#f59e0b" },
  { label: "Completed", count: 12, color: "#10b981" },
];

const deadlines = [
  { project: "SEO Audit", client: "Patel & Co", date: "Sep 12", day: "12", priority: "High", pay: "Overdue" },
  { project: "Fitness App", client: "Bolt Labs", date: "Sep 30", day: "30", priority: "Medium", pay: "Paid" },
  { project: "E-commerce", client: "Acme Co", date: "Oct 15", day: "15", priority: "High", pay: "Pending" },
  { project: "SaaS Dashboard", client: "Chen", date: "Dec 01", day: "01", priority: "High", pay: "Pending" },
];

const activity = [
  { who: "Alex Martin", what: "moved Fitness App to Review", when: "2h ago" },
  { who: "You", what: "invoiced Sarah Johnson $4,500", when: "5h ago" },
  { who: "Emma Wilson", what: "approved Brand Identity", when: "1d ago" },
];

function AreaChart({ data }: { data: typeof revenue }) {
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const w = 400, h = 120, pad = 12;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.v - min) / (max - min || 1)) * (h - pad * 2) - 10;
    return `${x},${y}`;
  }).join(" ");
  const area = `${pts} ${w - pad},${h - pad} ${pad},${h - pad}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="area-svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#g)" />
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((d.v - min) / (max - min || 1)) * (h - pad * 2) - 10;
        return <circle key={d.m} cx={x} cy={y} r="4" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" />;
      })}
    </svg>
  );
}

function Donut({ data }: { data: typeof pipeline }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  let acc = 0;
  return (
    <svg viewBox="0 0 100 100" className="donut">
      <circle cx="50" cy="50" r="32" fill="none" stroke="var(--code-bg)" strokeWidth="14" />
      {data.map(d => {
        const pct = (d.count / total) * 100;
        const dash = `${pct * 2.01} 201`;
        const rot = (acc / total) * 360;
        acc += d.count;
        return <circle key={d.label} cx="50" cy="50" r="32" fill="none" stroke={d.color} strokeWidth="14" strokeDasharray={dash} transform={`rotate(${rot - 90} 50 50)`} strokeLinecap="round" />;
      })}
      <text x="50" y="50" textAnchor="middle" dy="4" fontSize="10" fontWeight="800" fill="var(--text-h)">{total}</text>
      <text x="50" y="58" textAnchor="middle" fontSize="5" fill="var(--text)">projects</text>
    </svg>
  );
}

export default function Dashboard() {
  const maxPipe = Math.max(...pipeline.map(p => p.count));
  return (
    <div className="dashboard-bento">
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back to ClientArc 👋 — Bento Analytics</p>
        </div>
        <div className="header-cta">
          <Link to="/projects" className="btn-ghost">View Projects</Link>
          <Link to="/clients" className="btn-primary">+ New Client</Link>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-icon">{k.icon}</span>
              <span className={`kpi-trend ${k.trendUp === true ? "up" : k.trendUp === false ? "down" : "neutral"}`}>{k.trend}</span>
            </div>
            <h3>{k.label}</h3>
            <p className="kpi-value">{k.value}</p>
            <small>{k.sub}</small>
          </div>
        ))}
      </div>

      <div className="bento-grid">
        <div className="bento-card span-2">
          <div className="card-head"><h2>Revenue Trend</h2><span className="badge">Last 6 months</span></div>
          <AreaChart data={revenue} />
          <div className="x-labels">{revenue.map(r => <span key={r.m}>{r.m}</span>)}</div>
          <div className="revenue-foot"><strong>$9,400</strong> this month <span className="up">↑ 18%</span></div>
        </div>

        <div className="bento-card">
          <div className="card-head"><h2>Pipeline</h2><Link to="/projects" className="card-link">Kanban →</Link></div>
          <Donut data={pipeline} />
          <div className="pipeline">
            {pipeline.map(p => (
              <div key={p.label} className="pipe-row">
                <span className="dot" style={{ background: p.color }} /><span className="pipe-label">{p.label}</span>
                <div className="pipe-track"><div className="pipe-fill" style={{ width: `${(p.count / maxPipe) * 100}%`, background: p.color }} /></div>
                <span className="pipe-count">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card">
          <div className="card-head"><h2>Upcoming Deadlines</h2><span className="badge warn">4 due</span></div>
          <ul className="deadline-list">
            {deadlines.map(d => (
              <li key={d.project}>
                <div className="cal"><span className="cal-day">{d.day}</span><span className="cal-mon">{d.date.split(" ")[0]}</span></div>
                <div className="dl-info"><strong>{d.project}</strong><span>{d.client}</span></div>
                <span className={`priority priority-${d.priority.toLowerCase()}`}>{d.priority}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bento-card">
          <div className="card-head"><h2>Recent Clients</h2><Link to="/clients" className="card-link">Manage →</Link></div>
          <ul className="recent-list">
            <li><div className="avatar sm">SJ</div><div><strong>Sarah Johnson</strong><span>Acme Co • Active</span></div><div className="progress-wrap mini"><div className="progress-bar" style={{ width: "65%" }} /></div></li>
            <li><div className="avatar sm">AM</div><div><strong>Alex Martin</strong><span>Bolt Labs • Review</span></div><div className="progress-wrap mini"><div className="progress-bar" style={{ width: "90%" }} /></div></li>
            <li><div className="avatar sm">DC</div><div><strong>David Chen</strong><span>Chen Consulting • Lead</span></div><div className="progress-wrap mini"><div className="progress-bar" style={{ width: "10%" }} /></div></li>
          </ul>
        </div>

        <div className="bento-card">
          <div className="card-head"><h2>Activity</h2><span className="badge">Today</span></div>
          <ul className="activity">
            {activity.map(a => (
              <li key={a.what}><span className="act-dot" /><div><strong>{a.who}</strong> {a.what}<span className="when">{a.when}</span></div></li>
            ))}
          </ul>
          <div className="category-bars">
            <div className="cat"><span>Web Design</span><div className="pipe-track"><div className="pipe-fill" style={{ width: "65%", background: "var(--accent)" }} /></div><span>$12k</span></div>
            <div className="cat"><span>Development</span><div className="pipe-track"><div className="pipe-fill" style={{ width: "45%", background: "#10b981" }} /></div><span>$8.2k</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
