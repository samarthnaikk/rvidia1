# rvidia1

This is the backend codebase of rvidia
The website for the same is (here)[https://rvidia.suyashh.me]
The cli for the same is (here)[https://rvidia-cli.samarthnaikk.me]

## Key Files and Folders
- `admin.py`, `main.py`: Main application scripts.
- `requirements.txt`: Python dependencies.
- `vercel.json`: Vercel deployment configuration.
- `.env`: Environment variables (database, authentication, API keys).
- `data/`: Contains application logic and data files.
- `data/app.py`: Application entry point for the data module.
- `data/Dockerfile`: Docker configuration for containerization.
- `data/files/`: Sample data files.

## Environment Variables
The `.env` file contains sensitive configuration such as:
- Database URL
- JWT and NextAuth secrets
- Google OAuth credentials
- Gmail configuration for OTP
- Node environment
- Supabase project URL and API key

