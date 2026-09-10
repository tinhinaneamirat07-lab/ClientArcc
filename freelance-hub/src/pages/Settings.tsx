import { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import "./Settings.css";

export default function Settings(){
  const { theme, setTheme, density, setDensity, lang, setLang, t } = useSettings();

  // C - Workflow defaults (persist locally)
  const [defaultStatus,setDefaultStatus]=useState(()=> localStorage.getItem("fh_defaultStatus")||"Lead");
  const [defaultPriority,setDefaultPriority]=useState(()=> localStorage.getItem("fh_defaultPriority")||"Medium");
  const [defaultCategory,setDefaultCategory]=useState(()=> localStorage.getItem("fh_defaultCategory")||"Web Design");
  const [reminder,setReminder]=useState(()=> localStorage.getItem("fh_reminder")||"3");

  // D - Notifications
  const [notifDeadline,setNotifDeadline]=useState(()=> localStorage.getItem("fh_notifDeadline")!=="false");
  const [notifPayment,setNotifPayment]=useState(()=> localStorage.getItem("fh_notifPayment")!=="false");
  const [notifWeekly,setNotifWeekly]=useState(()=> localStorage.getItem("fh_notifWeekly")==="true");
  const [emailNotif,setEmailNotif]=useState(()=> localStorage.getItem("fh_emailNotif")||"you@ClientArc.com");

  // Payment methods
  const [bankEnabled,setBankEnabled]=useState(()=> localStorage.getItem("fh_bankEnabled")!=="false");
  const [bankIban,setBankIban]=useState(()=> localStorage.getItem("fh_bankIban")||"FR76 3000 1000 0100 1234 5678 019");
  const [paypalEnabled,setPaypalEnabled]=useState(()=> localStorage.getItem("fh_paypalEnabled")!=="false");
  const [paypalEmail,setPaypalEmail]=useState(()=> localStorage.getItem("fh_paypalEmail")||"you@paypal.com");
  const [stripeEnabled,setStripeEnabled]=useState(()=> localStorage.getItem("fh_stripeEnabled")==="true");

  // G - Integrations
  const [googleCal,setGoogleCal]=useState(()=> localStorage.getItem("fh_googleCal")==="true");
  const [drive,setDrive]=useState(()=> localStorage.getItem("fh_drive")!=="false");
  const [slack,setSlack]=useState(()=> localStorage.getItem("fh_slack")==="true");

  const [saved,setSaved]=useState(false);

  function save(){
    localStorage.setItem("fh_defaultStatus", defaultStatus);
    localStorage.setItem("fh_defaultPriority", defaultPriority);
    localStorage.setItem("fh_defaultCategory", defaultCategory);
    localStorage.setItem("fh_reminder", reminder);
    localStorage.setItem("fh_notifDeadline", String(notifDeadline));
    localStorage.setItem("fh_notifPayment", String(notifPayment));
    localStorage.setItem("fh_notifWeekly", String(notifWeekly));
    localStorage.setItem("fh_emailNotif", emailNotif);
    localStorage.setItem("fh_bankEnabled", String(bankEnabled));
    localStorage.setItem("fh_bankIban", bankIban);
    localStorage.setItem("fh_paypalEnabled", String(paypalEnabled));
    localStorage.setItem("fh_paypalEmail", paypalEmail);
    localStorage.setItem("fh_stripeEnabled", String(stripeEnabled));
    localStorage.setItem("fh_googleCal", String(googleCal));
    localStorage.setItem("fh_drive", String(drive));
    localStorage.setItem("fh_slack", String(slack));
    // theme/density/lang already persisted via context
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  function exportData(){
    const all: Record<string,string|null> = {};
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i)!; all[k]=localStorage.getItem(k); }
    const blob=new Blob([JSON.stringify({settings: all, exportedAt: new Date().toISOString()},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="ClientArc-backup.json"; a.click(); URL.revokeObjectURL(url);
  }
  function clearData(){ if(confirm("Clear all local data? This cannot be undone.")){ localStorage.clear(); location.reload(); } }

  return (
    <div className="settings-page">
      <div className="page-header"><div><h1>{t("settings")}</h1><p>Appearance, workflow, payments & integrations — changes apply instantly</p></div><button className="btn-primary" onClick={save}>{saved? t("saved"): t("save")}</button></div>

      <div className="settings-grid">

        <section className="settings-card">
          <h2>🎨 {t("appearance")} — B</h2>
          <p className="hint">Theme and density apply instantly site-wide. Language translates sidebar + this page.</p>
          <div className="form-grid">
            <label>Theme
              <select value={theme} onChange={e=>setTheme(e.target.value as any)}>
                <option value="system">System (auto)</option><option value="light">Light</option><option value="dark">Dark</option>
              </select>
            </label>
            <label>Density
              <select value={density} onChange={e=>setDensity(e.target.value as any)}>
                <option value="comfortable">Comfortable</option><option value="compact">Compact</option>
              </select>
            </label>
            <label>Language
              <select value={lang} onChange={e=>setLang(e.target.value as any)}>
                <option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option>
              </select>
            </label>
          </div>
          <div className="preview-row">
            <span className="preview" style={{background:"var(--bg)", border:"1px solid var(--border)", color:"var(--text-h)"}}>Preview: var(--bg) / var(--text-h)</span>
          </div>
        </section>

        <section className="settings-card">
          <h2>⚙️ {t("workflow")} — C</h2>
          <div className="form-grid">
            <label>Default Client Status<select value={defaultStatus} onChange={e=>setDefaultStatus(e.target.value)}><option>Lead</option><option>Proposal</option><option>Active</option></select></label>
            <label>Default Priority<select value={defaultPriority} onChange={e=>setDefaultPriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label>Default Category<select value={defaultCategory} onChange={e=>setDefaultCategory(e.target.value)}><option>Web Design</option><option>Mobile App</option><option>Branding</option><option>Consulting</option><option>Development</option></select></label>
            <label>Deadline Reminder<select value={reminder} onChange={e=>setReminder(e.target.value)}><option value="1">1 day before</option><option value="3">3 days before</option><option value="7">7 days before</option></select></label>
          </div>
          <p className="hint">New clients/projects in Clients/Projects pages will use these defaults.</p>
        </section>

        <section className="settings-card">
          <h2>🔔 {t("notifications")} — D</h2>
          <label className="toggle"><input type="checkbox" checked={notifDeadline} onChange={e=>setNotifDeadline(e.target.checked)} /> Deadline approaching ({reminder}d)</label>
          <label className="toggle"><input type="checkbox" checked={notifPayment} onChange={e=>setNotifPayment(e.target.checked)} /> Payment overdue alert</label>
          <label className="toggle"><input type="checkbox" checked={notifWeekly} onChange={e=>setNotifWeekly(e.target.checked)} /> Weekly summary (Monday)</label>
          <label>Notification Email<input type="email" value={emailNotif} onChange={e=>setEmailNotif(e.target.value)} placeholder="you@ClientArc.com" /></label>
        </section>

        <section className="settings-card">
          <h2>💳 {t("payments")}</h2>
          <div className="pay-method">
            <label className="toggle"><input type="checkbox" checked={bankEnabled} onChange={e=>setBankEnabled(e.target.checked)} /> Bank Transfer</label>
            {bankEnabled && <input value={bankIban} onChange={e=>setBankIban(e.target.value)} placeholder="IBAN" />}
          </div>
          <div className="pay-method">
            <label className="toggle"><input type="checkbox" checked={paypalEnabled} onChange={e=>setPaypalEnabled(e.target.checked)} /> PayPal</label>
            {paypalEnabled && <input value={paypalEmail} onChange={e=>setPaypalEmail(e.target.value)} placeholder="paypal email" />}
          </div>
          <div className="pay-method">
            <label className="toggle"><input type="checkbox" checked={stripeEnabled} onChange={e=>setStripeEnabled(e.target.checked)} /> Stripe</label>
            {stripeEnabled && <span className="hint">Connect Stripe in production — test mode enabled</span>}
          </div>
        </section>

        <section className="settings-card">
          <h2>🔗 {t("integrations")} — G</h2>
          <div className="integration"><div><strong>Google Calendar</strong><span>Sync deadlines</span></div><button className={googleCal?"btn-primary small":"btn-secondary small"} onClick={()=>setGoogleCal(!googleCal)}>{googleCal?"Connected":"Connect"}</button></div>
          <div className="integration"><div><strong>Google Drive</strong><span>Attachments</span></div><button className={drive?"btn-primary small":"btn-secondary small"} onClick={()=>setDrive(!drive)}>{drive?"Connected":"Connect"}</button></div>
          <div className="integration"><div><strong>Slack</strong><span>Notifications</span></div><button className={slack?"btn-primary small":"btn-secondary small"} onClick={()=>setSlack(!slack)}>{slack?"Connected":"Connect"}</button></div>
        </section>

        <section className="settings-card danger-zone">
          <h2>🗄️ {t("data")} — F</h2>
          <p>Export or wipe local data (clients, projects, settings). Stored in localStorage.</p>
          <div className="actions">
            <button className="btn-secondary" onClick={exportData}>Export JSON</button>
            <label className="btn-secondary" style={{cursor:"pointer"}}>Import<input type="file" accept=".json" hidden onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; f.text().then(t=>{ try{ const j=JSON.parse(t); Object.entries(j.settings||j).forEach(([k,v])=> localStorage.setItem(k, String(v))); alert("Imported — reloading"); location.reload(); } catch{ alert("Invalid JSON"); }}); }} /></label>
            <button className="btn-danger" onClick={clearData}>Clear All Data</button>
          </div>
        </section>

      </div>
    </div>
  );
}
