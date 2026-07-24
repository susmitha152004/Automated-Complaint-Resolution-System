# Automated Complaint Resolution System

An AI-powered municipal & civil complaint resolution platform built with **Node.js, Express, React, Tailwind CSS, Vite, and Google Gemini AI**.

The system automatically analyzes user complaints using Gemini AI multimodal capabilities, classifies them into municipal categories, detects priority levels, generates instant empathetic automated responses, suggests responsible departments, estimates resolution timeframes, and provides an administrative dashboard with real-time analytics.

---

## 🌟 Key Features

### 👤 Citizen User Features
- **User Authentication:** Register, login with JWT tokens, and edit profile.
- **AI Complaint Submission:** Submit complaints with title, description, location, address, and image evidence upload.
- **Live Gemini AI Analyzer:** Real-time AI analysis preview before submitting complaints.
- **Complaint History & Tracking:** View personal filed grievances, ticket numbers, assigned departments, and status timeline.
- **Public Ticket Tracker:** Search any ticket number (e.g., `CMP-2026-8812`) to check status.
- **Notifications:** Real-time status update alerts.
- **Dark Mode:** Seamless light/dark mode toggling.

### 🛡️ Admin Features
- **Admin Dashboard & Analytics:**
  - Key Metric Cards: Total Users, Total Complaints, Resolved, Pending, High Priority, Emergency.
  - Interactive Recharts Visualizations: Complaints by Category, Monthly Resolution Trend, Status Distribution.
- **Complaint Management:**
  - Search complaints by ID, title, citizen, or location.
  - Filter by 11 Complaint Categories, 4 Priority Levels, and 4 Status Levels.
  - Assign complaints to municipal departments and officers.
  - Update complaint status (`Pending` → `Under Review` → `Resolved` / `Rejected`) with official notes.
  - Delete invalid complaints.

---

## 🤖 Gemini AI Integration

The system leverages the official **`@google/genai` TypeScript SDK** on the server side with model **`gemini-3.6-flash`**.

### AI Analysis Capabilities:
1. **Category Classification:** Classifies into 11 categories (*Water Supply, Electricity, Roads, Garbage, Street Lights, Internet, Education, Health, Pollution, Public Transport, Others*).
2. **Priority Detection:** Evaluates urgency (*Low, Medium, High, Emergency*).
3. **Automated Response Generation:** Creates professional, empathetic citizen acknowledgments.
4. **Department Suggestion:** Maps complaints to responsible departments (*e.g., Water Supply & Sewerage Board*).
5. **Resolution Estimation:** Estimates resolution timeframes (*e.g., "12 Hours", "24 Hours"*).
6. **Possible Solution:** Suggests immediate workaround actions for citizens and field crews.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React Icons, Motion, Recharts
- **Backend:** Node.js, Express.js
- **Database:** Local JSON persistent data store engine with pre-seeded realistic complaints
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing
- **AI Integration:** `@google/genai` SDK (`gemini-3.6-flash`)

---

## 🔑 Environment Variables

Declare the following in your `.env` or `.env.example`:

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
JWT_SECRET="complaint_resolution_jwt_secret_key_2026"
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express backend + Vite middleware on Port 3000)
npm run dev

# 3. Build production bundle
npm run build

# 4. Start production server
npm run start
```

---

## 🧪 Demo Login Credentials

- **Admin Account:**
  - Email: `admin@gov.org`
  - Password: `admin123`
- **Citizen User Account:**
  - Email: `sarah@example.com`
  - Password: `user123`
