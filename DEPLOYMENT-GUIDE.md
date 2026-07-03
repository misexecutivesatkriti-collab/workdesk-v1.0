# Work Desk - Client Deployment Guide

## 🚀 Quick Start (Vercel Recommended)

### Step 1: Upload to GitHub
```bash
cd workdesk
 git init
 git add .
 git commit -m "Work Desk v1.0"
 git remote add origin YOUR_GIT_REPO_URL
 git push -u origin main
```

### Step 2: Import in Vercel
- Go to https://vercel.com
- Click "Add New" → "Project"
- Select your GitHub repository
- Click "Import"

### Step 3: Add Environment Variables (Required)

Go to: **Project Settings → Environment Variables**

| Variable Name | Where to Get | Example |
|---------------|--------------|---------|
| `BREVO_API_KEY` | https://app.brevo.com → Settings → API Keys | `xkeysib-xxxx...` |
| `BREVO_SENDER_EMAIL` | https://app.brevo.com → Senders & IP → Senders | `noreply@domain.com` |
| `BREVO_SENDER_NAME` | Any name you want | `Work Desk` |
| `SUPABASE_URL` | https://app.supabase.com → Project → Settings → API | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | https://app.supabase.com → Project → Settings → API | `eyJhbGc...` |
| `JWT_SECRET` | Generate with: `openssl rand -hex 32` | `a1b2c3d4e5f6...` |

### Step 4: Deploy!
- Click "Deploy" button
- Wait 2-3 minutes
- Your app will be live at the provided URL

---

## 📁 Project Structure

```
workdesk/
├── src/                          # Frontend (React + Vite)
│   ├── pages/                    # Page components
│   ├── components/               # UI components (common, layout, ui)
│   ├── context/                  # React Context providers
│   ├── lib/                      # Utility functions & services
│   ├── hooks/                    # Custom React hooks
│   └── App.jsx                   # Main App component
│
├── server/                      # Backend (Express.js)
│   ├── routes/                   # API route handlers
│   │   ├── adminRoutes.js        # Admin management
│   │   ├── authRoutes.js         # Authentication
│   │   ├── delegationRoutes.js   # Delegation management
│   │   ├── departmentRoutes.js   # Department management
│   │   ├── emailRoutes.js        # Email configuration & sending
│   │   ├── issueRoutes.js        # Issue management
│   │   ├── staffRoutes.js        # Staff management
│   │   ├── taskRoutes.js         # Task management
│   │   └── trashRoutes.js        # Trash/restore functionality
│   ├── auth.js                   # JWT authentication utilities
│   ├── db.js                     # Database utilities (SQLite - not used in production)
│   ├── index.js                  # Server entry point
│   ├── seed.js                   # Database seeding
│   ├── supabase.js               # Supabase client configuration
│   └── package.json              # Backend dependencies
│
├── public/                       # Static assets
│   ├── favicon.svg               # App icon
│   └── icons.svg                 # UI icons
│
├── package.json                  # Frontend dependencies & scripts
├── vercel.json                  # Vercel deployment configuration
├── vite.config.js               # Vite build configuration
├── index.html                   # Frontend entry point
└── SQL_SCHEMA.sql               # Supabase database schema
```

---

## 🎯 After Deployment

### 1. Setup Supabase Database

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Go to **SQL Editor** → **New Query**
4. Copy the entire content of `SQL_SCHEMA.sql` file
5. Run the query (this creates all tables and seed data)
6. Copy **Project URL** and **Service Role Key** from **Project Settings → API**

### 2. Setup Brevo Email Service

1. Go to [https://app.brevo.com](https://app.brevo.com)
2. Create an account (free tier available)
3. Go to **SMTP & API** → **API Keys**
4. Create a new API key (or use existing)
5. Copy the API key
6. Go to **Senders & IP** → **Senders**
7. Add your email address (e.g., `noreply@yourdomain.com`)
8. Verify it by clicking the verification link sent to that email

### 3. First Login

After deployment completes:
- Open your deployed app URL
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: mainadmin

⚠️ **IMPORTANT**: Change the password immediately after first login!
  - Go to Settings → Change Password

---

## 🏃 Other Hosting Options

### Option 1: Render (https://render.com)

1. Go to Render dashboard
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. **Build Command**: `npm run build`
5. **Start Command**: `cd server && node index.js`
6. Add all environment variables (same as Vercel)
7. Click **"Create Web Service"**

### Option 2: Railway (https://railway.app)

1. Go to Railway dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your repository
5. Add all environment variables
6. Click **"Deploy"**

### Option 3: Self-Hosted (VPS/Dedicated Server)

**Requirements:**
- Node.js 18 or higher
- npm or yarn
- Domain name (optional)
- Reverse proxy (Nginx/Apache recommended)

**Steps:**

```bash
# Clone your repository (if not already)
git clone YOUR_REPO_URL workdesk
cd workdesk

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Build frontend for production
npm run build

# Start the server
cd server
node index.js
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend - serve static files
    location / {
        root /path/to/workdesk/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API - proxy to Node server
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

After configuring Nginx:
```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Start your app with PM2 (recommended for production)
npm install -g pm2
pm2 start server/index.js --name workdesk
pm2 save
pm2 startup
```

---

## 📞 Troubleshooting

### Issue: 404 Error on API Endpoints

**Symptoms:**
- Frontend loads but API calls return 404
- `GET /api/health` returns 404

**Solutions:**
1. Check that the server is running: `node server/index.js`
2. Verify all environment variables are set correctly
3. Check Vercel/hosting deployment logs for errors
4. Ensure `vercel.json` exists in the root directory
5. For Vercel: Make sure the root `vercel.json` has the correct configuration

### Issue: Emails Not Sending

**Symptoms:**
- Email configuration is saved but emails are not being sent
- No errors in the UI

**Solutions:**
1. Verify `BREVO_API_KEY` is correct and not expired
2. Check that the sender email is verified in Brevo dashboard
3. Test the email configuration endpoint: `GET /api/email/config`
   - Should return masked configuration values
4. Check Brevo dashboard for email delivery status
5. Ensure you have credits in your Brevo account

### Issue: Database Connection Failed

**Symptoms:**
- API returns database connection errors
- Data is not loading
- "Connection refused" or "Invalid credentials" errors

**Solutions:**
1. Verify `SUPABASE_URL` is correct (no trailing slash)
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
3. Check that your Supabase project is active (not paused due to inactivity)
4. Test the connection using Supabase dashboard SQL editor
5. Ensure you've imported the SQL_SCHEMA.sql into your Supabase project

### Issue: Login Failed / Invalid Credentials

**Symptoms:**
- Cannot login with default credentials
- "Invalid credentials" error message

**Solutions:**
1. Use the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
2. Check if the admin user exists in the Supabase `admins` table
3. If using SQLite (local development), check `server/workdesk.db`
4. Verify the password in the database matches what you're entering
5. If you changed the password and forgot it, you'll need to reset it directly in the database

### Issue: Deployment Fails / Build Errors

**Symptoms:**
- Vercel/Render/Railway deployment fails
- Build errors in logs

**Solutions:**
1. Check the deployment logs in your hosting provider
2. Ensure Node.js version 18+ is selected
3. Verify all dependencies are listed in `package.json`
4. Run `npm install` locally to test dependency installation
5. Check for syntax errors in your code

---

## 📊 API Endpoints Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/admin/login` | Admin user login | ❌ |
| POST | `/api/auth/staff/login` | Staff user login | ❌ |
| POST | `/api/auth/change-password` | Change user password | ✅ |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | List all tasks | ✅ |
| POST | `/api/tasks` | Create new task | ✅ |
| PUT | `/api/tasks/:id/complete` | Mark task as complete | ✅ |
| DELETE | `/api/tasks/:id` | Soft delete task | ✅ |
| DELETE | `/api/tasks/:id/permanent` | Permanent delete (mainadmin) | ✅ |

### Staff
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/staff` | List all staff | ✅ |
| POST | `/api/staff` | Create new staff | ✅ |
| DELETE | `/api/staff/:id` | Delete staff | ✅ |
| POST | `/api/staff/:id/handover` | Create handover request | ✅ |
| GET | `/api/staff/handovers` | List handover requests | ✅ |

### Departments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/departments` | List all departments | ✅ |
| POST | `/api/departments` | Create new department | ✅ |
| DELETE | `/api/departments/:id` | Delete department | ✅ |

### Issues
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/issues` | List all issues | ✅ |
| POST | `/api/issues` | Create new issue | ✅ |
| PUT | `/api/issues/:id/resolve` | Resolve issue | ✅ |
| DELETE | `/api/issues/:id` | Delete issue | ✅ |

### Delegations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/delegations` | List all delegations | ✅ |
| POST | `/api/delegations` | Create new delegation | ✅ |
| PUT | `/api/delegations/:id/complete` | Complete delegation | ✅ |
| PUT | `/api/delegations/:id/extend` | Extend delegation | ✅ |
| DELETE | `/api/delegations/:id` | Delete delegation | ✅ |

### Trash (Main Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/trash` | List trashed items | ✅ |
| POST | `/api/trash/restore/:type/:id` | Restore item | ✅ |
| DELETE | `/api/trash/permanent/:type/:id` | Permanent delete | ✅ |
| DELETE | `/api/trash/clear-all` | Clear all trash | ✅ |

### Email Configuration (Main Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/email/config` | Get current config (masked) | ✅ |
| POST | `/api/email/config` | Update email config | ✅ |
| POST | `/api/email/config/remove` | **NEW**: Remove email config | ✅ |
| POST | `/api/email/send` | Send test email | ✅ |

### Activity & Health
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | ❌ |
| GET | `/api/activity` | Get activity log | ✅ |
| POST | `/api/activity` | Add activity entry | ✅ |

---

## 🎨 Features List

### ✅ Core Features
- **Task Management**: Create, assign, track, and manage tasks with status, priority, frequency, and notes
- **Staff Management**: Add, edit, and manage staff members with departments and designations
- **Department Management**: Create and manage departments with head roles and contacts
- **Issue Tracking**: Report, track, and resolve issues with full history
- **Delegation System**: Delegate tasks to other staff members with tracking

### ✅ Email Notifications (Brevo)
- Welcome email for new staff members
- Task assignment notifications
- Task completion confirmations
- Handover requests and responses
- Task reminders (overdue, due today, scheduled)
- Customizable email templates

### ✅ Data Management
- **Import/Export**: Full data backup and restore via JSON files
- **Soft Delete**: Move items to trash instead of permanent deletion
- **Restore**: Recover deleted items from trash
- **Permanent Delete**: Completely remove items (mainadmin only)
- **Activity Logging**: Track all user actions

### ✅ User Roles & Permissions
- **mainadmin**: Full access including user management, email config, and data import/export
- **admin**: Can manage tasks, staff, departments, but cannot manage other admins or email config
- **staff**: Can view and update their own tasks, change their password

---

## 🔐 Security Notes

1. **Never commit `.env` files** to Git - they contain sensitive credentials
2. **Use strong passwords** for all user accounts
3. **Rotate API keys** if they are ever compromised
4. **Use HTTPS** in production for secure communication
5. **Keep dependencies updated** to avoid security vulnerabilities

---

## 📦 What's NOT Included

To keep the zip file size small, the following are **NOT** included:
- `node_modules/` - Will be installed automatically with `npm install`
- `.git/` - Git repository history
- `.env` - Environment files (create your own)
- `workdesk.db*` - SQLite database files (use Supabase in production)
- `dist/` - Built frontend files (generated with `npm run build`)

**After extracting the zip, run:**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Build frontend
npm run build
```

---

## 📞 Need More Help?

1. **Check this guide again** - Most common issues are covered
2. **Check deployment logs** in your hosting provider
3. **Verify environment variables** are correctly set
4. **Test locally first** before deploying to production
5. **Contact support** if you still need assistance

---

**Version**: 1.0  
**Last Updated**: July 2026  
**Application**: Work Desk - Hospital/Office Management System
