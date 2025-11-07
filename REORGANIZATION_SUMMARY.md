# RVIDIA Folder Reorganization Summary

## ✅ Reorganization Complete

The RVIDIA project has been successfully reorganized into a clean backend/frontend structure.

---

## 📁 New Directory Structure

### Root Level

```
DevJam25/
├── backend/              ← All Python services & database
├── frontend/             ← Next.js application
├── package.json          ← Updated to point to frontend/
├── .env                  ← Updated DATABASE_URL path
├── .gitignore            ← Updated with new paths
├── STRUCTURE.md          ← Detailed structure documentation
└── run-backend.sh        ← Backend startup script
```

---

## 📦 Backend Folder (`/backend`)

**Contains all Python services and database:**

```
backend/
├── Admin/                ← Admin service
│   ├── main.py
│   ├── server.py
│   ├── core.py
│   ├── helper.py
│   ├── userside.py
│   ├── finalrun.py
│   ├── mycmd/
│   └── mydata/
├── User/                 ← User service
│   ├── client.py
│   ├── core.py
│   ├── SystemData.py
│   └── aipart.py
├── CrossNetwork/         ← Network relay & communication
│   ├── sender.py
│   ├── receiver.py
│   ├── relay_server.py
│   └── starter.py
├── prisma/               ← Database (MOVED HERE)
│   ├── schema.prisma
│   ├── dev.db
│   └── migrations/
├── scripts/              ← DB seed & utilities
│   ├── seed.ts
│   ├── export-users.ts
│   └── hash-passwords.ts
├── connector.py          ← Main backend connector
└── requirements.txt      ← Python dependencies
```

---

## 🎨 Frontend Folder (`/frontend`)

**Contains Next.js 14 application:**

```
frontend/
├── app/                  ← App directory (Next.js)
│   ├── api/              ← API routes
│   │   ├── auth/
│   │   ├── users/
│   │   ├── send-otp/
│   │   └── verify-otp/
│   ├── auth-debug/
│   ├── dashboard/
│   ├── signin/
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/           ← React components
│   ├── animated-waves.tsx
│   ├── google-sign-in-button.tsx
│   ├── dashboard-header.tsx
│   ├── protected-route.tsx
│   └── ...
├── hooks/                ← Custom React hooks
│   ├── use-auth.ts
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                  ← Utilities & clients
│   ├── auth-utils.ts
│   ├── auth.ts
│   ├── jwt-utils.ts
│   ├── prisma.ts         ← Prisma client
│   ├── user.ts
│   ├── otp/              ← OTP utilities
│   ├── mailer/           ← Email utilities
│   └── api/
├── public/               ← Static assets
│   ├── logos/
│   ├── avatars/
│   └── ...
├── styles/               ← Global CSS
├── types/                ← TypeScript types
│   └── spline.d.ts
├── middleware.ts         ← Next.js middleware
├── next.config.mjs       ← Next.js configuration
├── tsconfig.json         ← TypeScript configuration
├── postcss.config.mjs    ← Tailwind CSS configuration
├── components.json       ← shadcn/ui configuration
└── prisma.json           ← Prisma configuration
```

---

## ⚙️ Configuration Updates

### 1. **package.json** (Root)

- Updated all npm scripts to run from `frontend/` directory
- Scripts automatically `cd` into frontend before running Next.js commands

```json
"scripts": {
  "dev": "cd frontend && next dev",
  "build": "cd frontend && next build",
  "start": "cd frontend && next start"
}
```

### 2. **.env** (Root)

- Updated `DATABASE_URL` to point to new prisma location:

```
DATABASE_URL="file:/Users/suyashsingh/Documents/DevProjects/cybersec/RVIDIA/DevJam25/backend/prisma/dev.db"
```

### 3. **.gitignore**

- Updated to ignore files in both backend and frontend folders
- Added Python-specific ignores: `__pycache__/`, `.venv`, `*.pyc`
- Added Node.js-specific ignores: `node_modules`, `.next`

---

## 🚀 How to Run

### Frontend (Next.js)

```bash
# From root directory
npm run dev          # Development mode (port 3003)
npm run build        # Build for production
npm start            # Production server
```

### Backend (Python)

```bash
# From root directory
cd backend

# Setup (first time)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run services
python connector.py
```

Or use the provided script:

```bash
bash run-backend.sh
```

---

## 📝 Key Benefits

✅ **Clean Separation** - Backend and frontend are clearly separated
✅ **Scalability** - Easy to add new services or features
✅ **Maintainability** - Each folder has its own configuration
✅ **CI/CD Ready** - Can build/deploy backend and frontend independently
✅ **Version Control** - Clear what's frontend vs backend changes
✅ **Development** - Different teams can work on backend/frontend separately

---

## 🔗 Important Notes

1. **Database**: Lives in `backend/prisma/` but is accessed by frontend via Prisma client
2. **Environment Variables**: Configured in root `.env` file
3. **Node Modules**: Keep in root (all npm dependencies)
4. **Python Venv**: Should be created in `backend/` folder
5. **Port 3003**: Frontend runs on port 3003 (configured in frontend)
6. **API Routes**: All in `frontend/app/api/` - backend services are separate Python apps

---

## 📚 Documentation

For detailed information, see:

- `STRUCTURE.md` - Complete folder structure guide
- `frontend/README.md` - Frontend-specific setup
- `backend/requirements.txt` - Python dependencies
- Root `README.md` - Project overview

---

## ✨ Next Steps

1. **Commit Changes**: `git add . && git commit -m "Reorganize folder structure"`
2. **Install Dependencies**: `npm install` (if needed)
3. **Start Development**:
   - Terminal 1: `npm run dev` (frontend)
   - Terminal 2: `cd backend && python connector.py` (backend)

---

**Reorganization completed successfully! 🎉**
