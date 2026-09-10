# ClientArc

**A freelance client & project management dashboard — track your pipeline, projects, tasks, and payments in one place.**

ClientArc is a lightweight CRM built for freelancers and small studios. It brings together client relationships, project delivery, task tracking, and revenue insights into a single, fast, dark-themed workspace.

🔗 **Live demo:** [clientarcc.vercel.app](https://clientarcc.vercel.app/)

---

## ✨ Features

### 📊 Dashboard
- At-a-glance stats: total revenue, active projects, pending invoices, and overdue payments
- Revenue trend chart (last 6 months)
- Pipeline breakdown by stage (Lead, Proposal, Active, Review, Completed)
- Upcoming deadlines, recent clients, and a live activity feed

### 👥 Clients
- Manage your full client list with company, category, and priority tags
- Track budget, payment status (Paid / Pending), and project progress per client
- Filter and sort by status, payment, priority, category, or deadline
- Quick search across name, company, project, and tags

### 📁 Projects
- Kanban board with **Planning → In Progress → Review → On Hold → Completed** stages
- Grid and List views in addition to Kanban
- Per-project budget, deadline, milestones, and progress tracking
- Linked directly to clients

### ✅ Tasks
- Kanban board (**Todo → In Progress → Review → Done**) and List view
- Time estimates, due dates, priority levels, and tags per task
- Tasks linked to their parent project and client

### ⚙️ Settings
- **Appearance** — theme (light/dark/system), density, and language
- **Workflow defaults** — default client status, priority, category, and deadline reminders
- **Notifications** — deadline alerts, overdue payment alerts, weekly summaries
- **Payment methods** — bank transfer, PayPal, Stripe
- **Integrations** — Google Calendar, Google Drive, Slack
- **Data & privacy** — export/import your data as JSON, or wipe it entirely

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Styling:** CSS
- **Backend / Persistence:** Supabase
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (or yarn/pnpm)
- A [Supabase](https://supabase.com/) project (for auth and data persistence)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-github-username>/clientarc.git
cd clientarc

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

---

## 📂 Project Structure

```
clientarc/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/            # Dashboard, Clients, Projects, Tasks, Settings
│   ├── lib/               # Supabase client & helpers
│   ├── types/            # TypeScript types/interfaces
│   └── App.tsx
├── public/
├── .env.example
├── .gitignore
└── package.json
```

> Adjust this section to match your actual folder layout.

---

## 🗺️ Roadmap

- [ ] Invoice generation and PDF export
- [ ] Multi-user / team collaboration
- [ ] Recurring tasks and projects
- [ ] Native Stripe payment collection

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

No license has been added yet. All rights reserved unless a LICENSE file is added.

---

## 📬 Contact

Built by Amirat Tinhinane — feel free to reach out with questions or feedback.
