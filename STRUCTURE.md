# RVIDIA Project Structure

This project is now organized into **Backend** and **Frontend** folders for better separation of concerns.

## 📁 Folder Structure

```
DevJam25/
├── backend/                 # Python backend services
│   ├── Admin/              # Admin service
│   │   ├── main.py
│   │   ├── server.py
│   │   ├── core.py
│   │   ├── helper.py
│   │   ├── userside.py
│   │   ├── finalrun.py
│   │   ├── mycmd/
│   │   └── mydata/
│   ├── User/               # User service
│   │   ├── client.py
│   │   ├── core.py
│   │   ├── SystemData.py
│   │   └── aipart.py
│   ├── CrossNetwork/       # Network communication
│   │   ├── sender.py
│   │   ├── receiver.py
│   │   ├── relay_server.py
│   │   └── starter.py
│   ├── prisma/             # Database schema & migrations
│   │   ├── schema.prisma
│   │   ├── dev.db
│   │   └── migrations/
│   ├── scripts/            # Database scripts
│   ├── connector.py        # Main connector
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js frontend application
│   ├── app/               # Next.js 14 app directory
│   │   ├── api/           # API routes
│   │   ├── auth-debug/
│   │   ├── dashboard/
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── ...
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & client
│   │   ├── auth-utils.ts
│   │   ├── prisma.ts     # Prisma client
│   │   ├── otp/
│   │   └── mailer/
│   ├── public/            # Static assets
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript types
│   ├── middleware.ts      # Next.js middleware
│   ├── next.config.mjs    # Next.js config
│   ├── tsconfig.json      # TypeScript config
│   ├── postcss.config.mjs # Tailwind config
│   ├── components.json    # shadcn/ui config
│   └── prisma.json        # Prisma config
│
├── .env                   # Environment variables (root)
├── package.json           # NPM scripts point to frontend/
├── .gitignore
├── README.md
└── ...

```

## 🚀 Running the Project

### Frontend (Next.js)

```bash
npm run dev          # Development mode (port 3003)
npm run build        # Build for production
npm start            # Start production server
```

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
python connector.py  # Run connector service
```

## 📦 Environment Configuration

The `.env` file in the root directory contains:

- `DATABASE_URL`: Points to `backend/prisma/dev.db`
- `GOOGLE_*`: OAuth credentials
- `GMAIL_*`: Email configuration
- All other Next.js config variables

## 🗂️ File Locations

### Frontend API Routes

- Authentication: `/frontend/app/api/auth/`
- User operations: `/frontend/app/api/users/`
- OTP/Email: `/frontend/app/api/send-otp/`, `/frontend/app/api/verify-otp/`

### Backend Services

- Admin Panel: `backend/Admin/`
- User Service: `backend/User/`
- Network Relay: `backend/CrossNetwork/`
- Database: `backend/prisma/`

## 📝 Notes

- All npm scripts are run from the root directory
- Scripts automatically `cd` into `frontend/` to run Next.js commands
- Prisma client in frontend can access database at `backend/prisma/dev.db`
- Python services in backend are independent and can be run separately
