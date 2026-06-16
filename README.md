<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="frontend/public/logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="frontend/public/logo-light.png">
  <img alt="SpendWise Logo" src="frontend/public/logo-light.png" width="120">
</picture>

# SpendWise

### Your Personal Finance Command Center

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://spendwise-personal-finance-tracker-mern.vercel.app/)
[![API Status](https://img.shields.io/badge/⚡_API-Render-46E3B7?style=for-the-badge&logo=render)](https://spendwise-personal-finance-tracker-mern.onrender.com)
[![GitHub](https://img.shields.io/badge/📦_Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/balaji-mallepalli/SpendWise-Personal-Finance-Tracker-MERN)

*A modern full-stack MERN web application for tracking expenses, managing budgets, and visualizing spending patterns — built with MongoDB, Express.js, React & Node.js.*

---

</div>

## 🎯 About The Project

SpendWise is a **production-grade personal finance tracker** built as a Full Stack Development course project. It features a premium monochrome UI with dark/light theme support, secure JWT authentication, real-time budget monitoring, and interactive data visualizations — all deployed on modern cloud infrastructure.

<div align="center">

| 🔐 Secure Auth | 📊 Live Charts | 💳 Multi-Account | 🎯 Smart Budgets | 📥 CSV Export | 🌙 Dark Mode |
|:---:|:---:|:---:|:---:|:---:|:---:|

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- JWT-based session management
- Bcrypt password hashing
- Protected API routes
- Secure token refresh flow

</td>
<td width="50%">

### 💳 Account Management
- Multiple account types (Bank, Cash, Wallet)
- Independent balance tracking
- Automatic balance updates on transactions
- Account-wise financial overview

</td>
</tr>
<tr>
<td width="50%">

### 📊 Dashboard Analytics
- Total Income / Expenses / Net Balance cards
- Category-wise Pie Chart breakdown
- Daily spending trend Line Chart
- Real-time data aggregation

</td>
<td width="50%">

### 🎯 Smart Budgeting
- Monthly category-wise budget limits
- Visual progress bar tracking
- Auto-alert at 90% threshold
- Overspend detection and notification

</td>
</tr>
<tr>
<td width="50%">

### 📝 Transaction Management
- Full CRUD for income & expenses
- Category classification with icons
- Date-stamped transaction history
- CSV export for offline auditing

</td>
<td width="50%">

### 🎨 Premium UI/UX
- Monochrome glassmorphism design
- Dark / Light theme toggle
- Smooth micro-animations
- Fully responsive layout

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     🖥️  CLIENT TIER                         │
│              React 19 • Vite • Tailwind CSS v4              │
│         Recharts • Framer Motion • Axios • Lucide           │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTPS / REST (JSON)
                           │  Authorization: Bearer <JWT>
┌──────────────────────────┴──────────────────────────────────┐
│                    ⚙️  APPLICATION TIER                      │
│            Express.js • Node.js • Mongoose ODM              │
│            bcryptjs • jsonwebtoken • cors • dotenv           │
└──────────────────────────┬──────────────────────────────────┘
                           │  Mongoose Driver (TCP 27017)
┌──────────────────────────┴──────────────────────────────────┐
│                     🗄️  DATA TIER                            │
│                    MongoDB Atlas (Cloud)                     │
│    Users • Transactions • Budgets • Accounts • Categories   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|:---:|:---|
| **Frontend** | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose_ODM-880000?style=flat-square) |
| **Auth** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) ![Bcrypt](https://img.shields.io/badge/bcryptjs-003A70?style=flat-square) |
| **Testing** | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) |
| **DevOps** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) |

</div>

---

## 📂 Project Structure

```
SpendWise/
├── 📁 backend/
│   ├── config/
│   │   └── db.js            # Mongoose connection config
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification middleware
│   ├── models/              # Mongoose schemas (User, Transaction, Budget...)
│   ├── routes/              # Express route handlers (auth, transactions...)
│   ├── server.js            # Express app entry point & CORS config
│   ├── package.json
│   ├── Procfile             # Node.js config for Render
│   └── .env.example
│
├── 📁 frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Charts, Forms, AlertBanner...
│   │   ├── pages/           # Dashboard, Transactions, Budgets, Accounts...
│   │   ├── context/         # AuthContext (JWT), ThemeContext (Dark/Light)
│   │   ├── services/        # Axios API service layer
│   │   ├── App.jsx          # React Router configuration
│   │   └── index.css        # Global styles & CSS design tokens
│   ├── vercel.json          # SPA routing config for Vercel
│   └── package.json
│
├── 📄 SpendWise_FullStack_Report.pdf   # Final project report
├── 🖼️ 1.Architecture.png               # Architecture diagram
├── 🖼️ 2.ER-Diagram.png                 # Entity-Relationship diagram
├── 🖼️ 3.user-flow.png                  # User flow diagram
├── 🖼️ 4.MVC.png                        # MVC pattern diagram
├── 🖼️ backend-structure.png            # Backend folder structure
├── 🖼️ frontend-structure.png           # Frontend folder structure
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

```
Node.js  ≥ v18    •    npm  ≥ 9    •    MongoDB Atlas account
```

### 1️⃣ Clone the repository

```bash
git clone https://github.com/balaji-mallepalli/SpendWise-Personal-Finance-Tracker.git
cd SpendWise-Personal-Finance-Tracker
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env           # Add your MONGODB_URL & SECRET_KEY
npm run dev
```

> API running at `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> App available at `http://localhost:5173`

---

## 🧪 Testing

```bash
# Frontend tests (UI components & routing)
cd frontend && npm run test
```

---

## ☁️ Deployment

<div align="center">

| Service | Platform | Status |
|:--------|:---------|:------:|
| **Frontend** | Vercel | [![Vercel](https://img.shields.io/badge/✅_Live-000000?style=flat-square&logo=vercel&logoColor=white)](https://spend-wise-personal-finance-tracker.vercel.app/) |
| **Backend API** | Render | [![Render](https://img.shields.io/badge/✅_Live-46E3B7?style=flat-square&logo=render&logoColor=white)](https://spendwise-personal-finance-tracker.onrender.com) |
| **Database** | MongoDB Atlas | ![MongoDB](https://img.shields.io/badge/✅_Cloud-47A248?style=flat-square&logo=mongodb&logoColor=white) |

</div>

---

## 📄 API Endpoints

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Authenticate & receive JWT |
| `GET` | `/auth/me` | Get current user profile |
| `GET` | `/transactions/` | List all transactions |
| `POST` | `/transactions/` | Create a new transaction |
| `PUT` | `/transactions/{id}` | Update a transaction |
| `DELETE` | `/transactions/{id}` | Delete a transaction |
| `GET` | `/transactions/export` | Export transactions as CSV |
| `GET` | `/budgets/` | List all budgets |
| `POST` | `/budgets/` | Create/update a budget |
| `GET` | `/accounts/` | List all accounts |
| `POST` | `/accounts/` | Create a new account |
| `GET` | `/categories/` | List all categories |
| `GET` | `/dashboard/summary` | Get dashboard analytics |

---

## 📖 Documentation

| Document | Description |
|:---------|:------------|
| [📄 Final Project Report](SpendWise_FullStack_Report.pdf) | Complete Full Stack Development course report |

---

<div align="center">

### Built with ❤️ by Balaji Mallepalli

*Full Stack Development Course Project — April 2026*

</div>
