# 🚀 Student ERP Feedback System - Complete Setup Guide

## 📋 Prerequisites
- Node.js 18+ installed
- Git installed
- A GitHub account
- 30 minutes of your time

---

## 🏗️ Step 1: Create Project Structure (5 min)

### Create the project folder and files:

```bash
# Create main project folder
mkdir erp-feedback-system
cd erp-feedback-system

# Initialize Next.js project
npm init -y
```

### Create all folders:
```bash
mkdir -p app/api/auth/login
mkdir -p app/api/auth/register
mkdir -p app/api/auth/logout
mkdir -p app/api/courses
mkdir -p app/api/feedback/final-submit
mkdir -p app/login
mkdir -p app/register
mkdir -p app/dashboard
mkdir -p app/feedback/success
mkdir -p app/feedback/[courseId]
mkdir -p components
mkdir -p lib
mkdir -p prisma
```

### Copy all the files I provided into their respective locations:
- `package.json` → root
- `.env.example` → root (rename to `.env` and fill in values)
- `prisma/schema.prisma` → prisma folder
- `prisma/seed.ts` → prisma folder
- All `lib/*.ts` files → lib folder
- All `app/**/*.tsx` files → their respective app folders
- All `components/*.tsx` files → components folder
- Config files → root

---

## 📦 Step 2: Install Dependencies (3 min)

```bash
npm install
```

This will install all packages from package.json.

---

## 🗄️ Step 3: Setup Database (10 min)

### Option A: Vercel Postgres (Recommended - FREE)

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Create a new project (don't deploy yet)
3. Go to Storage tab → Create Database → Postgres
4. Copy the connection string (starts with `postgres://...`)
5. Create `.env` file in root:

```env
DATABASE_URL="your-vercel-postgres-url-here"
JWT_SECRET="any-random-string-here-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Option B: Supabase (Also FREE)

1. Go to [Supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the connection string
5. Add to `.env` file

### Initialize Database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with dummy data
npx prisma db seed
```

You should see:
```
✅ Teachers created
✅ Courses created
✅ Demo student created

📝 Demo Login Credentials:
Email: demo@college.edu
Password: password123
```

---

## 🧪 Step 4: Test Locally (5 min)

```bash
npm run dev
```

Open http://localhost:3000

### Test the flow:
1. Click "Register here" and create a new account
2. OR use demo credentials:
   - Email: `demo@college.edu`
   - Password: `password123`
3. Navigate to Dashboard
4. Click menu (⋮) → Feedback Section
5. Give feedback for a course
6. Complete all courses
7. Click "Final Submit"

---

## 🌐 Step 5: Deploy to Vercel (5 min)

### Initialize Git:

```bash
git init
git add .
git commit -m "Initial commit - ERP Feedback System"
```

### Push to GitHub:

1. Create a new repository on GitHub
2. Copy the commands GitHub provides:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Deploy on Vercel:

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add Environment Variables:
   - `DATABASE_URL` (your postgres URL)
   - `JWT_SECRET` (same random string)
   - `NEXT_PUBLIC_APP_URL` (will be `https://your-app.vercel.app`)
6. Click "Deploy"

**Wait 2-3 minutes...**

✅ **YOUR APP IS LIVE!**

You'll get a URL like: `https://erp-feedback-system.vercel.app`

---

## 🎯 Step 6: Run Database Seed on Production (2 min)

After deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run seed command
vercel env pull .env.local
npx prisma db seed
```

OR manually run seed from Vercel dashboard.

---

## 📱 Testing Your Live App

1. Visit your Vercel URL
2. Register a new student OR use demo account
3. Test complete flow
4. Share with friends! 🎉

---

## 🔐 Demo Credentials

**Email:** demo@college.edu  
**Password:** password123

**Courses Available:**
- CSE301 - Data Structures (Prof. A. Kumar)
- CSE302 - Operating Systems (Prof. B. Sharma)
- CSE303 - Database Management (Prof. C. Verma)
- CSE304 - Computer Networks (Prof. D. Singh)

---

## 🐛 Common Issues & Fixes

### Issue 1: "Module not found" error
```bash
npm install
npx prisma generate
```

### Issue 2: Database connection failed
- Check `.env` file has correct DATABASE_URL
- Make sure Vercel Postgres is created
- Run `npx prisma db push` again

### Issue 3: "Unauthorized" on pages
- Clear browser cookies
- Login again
- Check JWT_SECRET is set in .env

### Issue 4: Build fails on Vercel
- Make sure all environment variables are added in Vercel dashboard
- Check deployment logs for specific error
- Ensure `prisma generate` is in postinstall script

---

## 📊 Project Structure Overview

```
erp-feedback-system/
├── app/
│   ├── api/               # API routes (backend)
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── dashboard/         # Dashboard page
│   ├── feedback/          # Feedback pages
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Home (redirects to login)
├── components/            # Reusable components
├── lib/                   # Utilities (db, auth)
├── prisma/               # Database schema & seed
├── .env                  # Environment variables
└── package.json          # Dependencies

```

---

## 🎨 Customization Ideas

1. **Change Colors:** Edit Tailwind classes in components
2. **Add More Questions:** Modify arrays in `FeedbackFormClient.tsx`
3. **Add Admin Panel:** Create `/app/admin` folder with admin routes
4. **Email Notifications:** Add nodemailer after submission
5. **Export Reports:** Add CSV export functionality

---

## 📚 Tech Stack Summary

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (jose library)
- **Deployment:** Vercel
- **Icons:** lucide-react

---

## ✅ Checklist

- [ ] Project folder created
- [ ] All files copied
- [ ] Dependencies installed
- [ ] Database setup (Vercel/Supabase)
- [ ] `.env` file configured
- [ ] Database seeded
- [ ] Tested locally
- [ ] Pushed to GitHub
- [ ] Deployed on Vercel
- [ ] Production database seeded
- [ ] Live app tested

---

## 🎉 Congratulations!

Your Student ERP Feedback System is now live and ready to demo!

**Share your live URL:** `https://your-app.vercel.app`

Need help? Check:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 💡 Next Steps

1. Add more students via register page
2. Create more courses via Prisma Studio
3. Collect feedback from real users
4. Add analytics dashboard for admin
5. Export feedback reports

**Good luck with your demo! 🚀**