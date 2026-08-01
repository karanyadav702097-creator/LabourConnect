# LabourConnect: India's Smart Daily Labour Marketplace

LabourConnect is a production-ready, enterprise-grade marketplace connecting daily wage labourers with customers. It features role-based access for Customers, Workers, and Admins.

## 🚀 Tech Stack
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Shadcn UI
- **Backend:** Supabase (PostgreSQL, PostGIS, Auth, Storage, Edge Functions)
- **Infrastructure:** Vercel (Deployment), GitHub (CI/CD)
- **Integrations:** Razorpay (Payments), Twilio (SMS), Google Maps (GPS)

---

## 📂 Project Structure
```text
labour-connect/
├── src/
│   ├── apps/
│   │   ├── customer/   # Customer-specific screens & logic
│   │   ├── worker/     # Worker-specific screens & logic
│   │   ├── admin/      # Administrative dashboard
│   │   └── auth/       # OTP-based authentication flow
│   ├── components/     # Shared UI components
│   ├── lib/            # Core clients (Supabase)
│   ├── services/       # Payments, OCR, AI Matching, SMS
│   └── types/          # Global TypeScript definitions
├── supabase/
│   ├── functions/      # Edge functions (Razorpay, Twilio)
│   └── schema.sql      # Production database schema
└── tailwind.config.js  # Theme configuration
```

---

## 🛠 Installation Guide

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. Enable the **PostGIS** extension in the SQL Editor.
3. Run the contents of `supabase/schema.sql`.
4. Enable **Phone Auth** in Auth settings (India/Twilio).
5. Create a storage bucket named `verification_docs` (Private).

### 2. Local Environment Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file in the root:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_MAPS_KEY=your_maps_key
VITE_RAZORPAY_KEY_ID=your_razorpay_id
```

### 3. Running the App
```bash
npm run dev
```

---

## 🛳 Deployment Guide (Vercel)
1. Push the code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add the Environment Variables listed above in Vercel settings.
4. Deploy.

---

## 🛡 Security & Compliance
- **RLS:** All tables use Row Level Security policies.
- **Privacy:** Aadhaar numbers are hashed and images stored in encrypted buckets.
- **Safety:** One-tap SOS triggers immediate alerts to admins and emergency contacts.

## 🤖 AI Features
- **Smart Matching:** Rankings based on distance, rating, and job completion history.
- **Dynamic Pricing:** Real-time demand-based pricing suggestions.
- **OCR:** Automated Aadhaar text extraction for faster onboarding.
