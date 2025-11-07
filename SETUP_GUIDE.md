# RVIDIA Development Setup Guide

After folder reorganization, here's how to set up and run the project.

## 🎯 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.8+
- Git

### Step 1: Install Frontend Dependencies

```bash
cd /Users/suyashsingh/Documents/DevProjects/cybersec/RVIDIA/DevJam25
npm install
# or
pnpm install
```

### Step 2: Install Backend Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Setup Environment Variables

The `.env` file is already configured. Verify these key variables:

```bash
cat .env | grep -E "DATABASE_URL|GOOGLE|GMAIL"
```

Expected output should show:

- `DATABASE_URL` pointing to `backend/prisma/dev.db`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI="http://localhost:3003/api/auth/google/callback"`

### Step 4: Start Development Servers

**Terminal 1 - Frontend:**

```bash
cd /Users/suyashsingh/Documents/DevProjects/cybersec/RVIDIA/DevJam25
npm run dev
# Runs at http://localhost:3003
```

**Terminal 2 - Backend (Python):**

```bash
cd /Users/suyashsingh/Documents/DevProjects/cybersec/RVIDIA/DevJam25/backend
source venv/bin/activate
python connector.py
```

---

## 📁 Project Structure Reminder

```
DevJam25/
├── backend/                ← Python services
│   ├── Admin/             ← Admin panel service
│   ├── User/              ← User service
│   ├── CrossNetwork/      ← Network communication
│   ├── prisma/            ← Database (SQLite)
│   ├── connector.py       ← Main entry point
│   └── requirements.txt   ← Python packages
│
├── frontend/              ← Next.js app
│   ├── app/              ← App directory (routes)
│   ├── components/       ← React components
│   ├── lib/              ← Utilities & Prisma client
│   ├── public/           ← Static assets
│   ├── next.config.mjs   ← Next.js config
│   └── tsconfig.json     ← TypeScript config
│
├── package.json          ← Root npm scripts
├── .env                  ← Environment variables
└── STRUCTURE.md          ← Detailed structure guide
```

---

## 🔧 Common Tasks

### Building for Production

**Frontend:**

```bash
npm run build
npm run prod  # or npm start
```

**Backend:**

```bash
# Python services run as-is, no build needed
python backend/connector.py
```

### Database Management

**View database:**

```bash
cd frontend
npx prisma studio
```

**Create migration:**

```bash
cd frontend
npx prisma migrate dev --name "migration_name"
```

**Reset database:**

```bash
cd frontend
npx prisma db push --force-reset
```

### Running Tests (if configured)

```bash
npm run lint      # Frontend linting
npm run test      # Frontend tests (if configured)
```

---

## 🐛 Troubleshooting

### Port 3003 Already in Use

```bash
# Find and kill process on port 3003
lsof -i :3003
kill -9 <PID>
```

### Python Venv Issues

```bash
# Recreate venv
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Prisma Connection Error

```bash
# Verify DATABASE_URL in .env points to correct location
cat ../.env | grep DATABASE_URL

# Regenerate Prisma client
cd frontend
npx prisma generate
```

### Node Modules Issues

```bash
# Clean reinstall
npm ci  # or
npm install
```

---

## 📊 File Organization Logic

### Backend (Python)

- **Admin**: Administrative functions and dashboard
- **User**: User-facing services and data
- **CrossNetwork**: Inter-service communication and relay
- **prisma**: Database schema and migrations
- **connector.py**: Main entry point connecting all services

### Frontend (Next.js)

- **app/**: Pages and API routes using Next.js 14 App Router
- **components/**: Reusable UI components
- **lib/**: Utilities, hooks, and Prisma client
- **public/**: Static images, fonts, etc.
- **Configuration files**: next.config.mjs, tsconfig.json, etc.

---

## 🔐 Security Notes

1. **.env file**: Contains sensitive credentials - never commit
2. **GitHub**: Already configured to ignore `.env` via `.gitignore`
3. **Google OAuth**: Update `GOOGLE_REDIRECT_URI` if deploying to different domain
4. **Database**: `backend/prisma/dev.db` is SQLite (development only)

---

## 📚 Additional Resources

- `STRUCTURE.md` - Complete folder structure
- `REORGANIZATION_SUMMARY.md` - What changed and why
- `frontend/README.md` - Frontend-specific setup
- `.env` - All environment variables (with comments)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Frontend runs on port 3003: `npm run dev`
- [ ] Backend Python services can import from requirements
- [ ] `.env` DATABASE_URL points to `backend/prisma/dev.db`
- [ ] Google OAuth redirects working
- [ ] Database can be accessed: `npx prisma studio`

---

**Happy coding! 🚀**
