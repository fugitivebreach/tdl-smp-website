# TDL SMP Website Deployment Guide

## 🚀 Quick Deploy to Railway (Recommended)

### Step 1: Prepare Your Code
1. Push your code to GitHub repository
2. Make sure all files are committed including:
   - `package.json`
   - `start-prod.js`
   - `railway.json`
   - All your website files

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your TDL SMP repository
4. Railway will automatically detect Node.js and deploy

### Step 3: Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```
NODE_ENV=production
PORT=3000
SITE_NAME=TDL SMP
SITE_DESCRIPTION=The ultimate Minecraft SMP experience
ADMIN_USERNAME=TDLAdmin
ADMIN_PASSWORD=TDL_Super_Secure_Admin_Password_2024!
SESSION_SECRET=your_super_secure_session_secret_here
DISCORD_WEBHOOK_URL=your_discord_webhook_url_for_appeals
REPORTS_WEBHOOK_URL=your_discord_webhook_url_for_reports
```

### Step 4: Get Your Public URL
- Railway provides a free subdomain like: `your-app-name.up.railway.app`
- You can also connect a custom domain in the settings

---

## 🌐 Alternative: Deploy to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node start-prod.js`
   - **Environment**: Node

### Step 3: Add Environment Variables
Same variables as Railway above.

---

## 🔧 VPS Deployment (Advanced)

### Requirements
- Ubuntu/Debian VPS (DigitalOcean, Linode, AWS EC2)
- Domain name (optional but recommended)

### Setup Commands
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/yourusername/tdl-smp-website.git
cd tdl-smp-website

# Install dependencies
npm install

# Create production environment file
nano .env
# (Add your environment variables)

# Start with PM2
pm2 start start-prod.js --name "tdl-smp"
pm2 startup
pm2 save

# Install Nginx (for domain and SSL)
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/tdl-smp
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Discord webhooks tested and working
- [ ] Database tables created (SQLite auto-creates)
- [ ] File upload directory permissions set
- [ ] Admin login credentials secure
- [ ] All forms tested (appeals and reports)
- [ ] Navigation working correctly
- [ ] Mobile responsive design verified

---

## 🔒 Security Notes

1. **Never commit `.env` file** - it's already in `.gitignore`
2. **Use strong passwords** for admin accounts
3. **Enable HTTPS** in production (automatic on Railway/Render)
4. **Regular backups** of SQLite database files
5. **Monitor file uploads** for storage limits

---

## 🎯 Post-Deployment

After deployment:
1. Test all forms (appeal and report submission)
2. Verify Discord webhooks are working
3. Test admin dashboard login and functionality
4. Check mobile responsiveness
5. Monitor server logs for any issues

Your TDL SMP website will be live and accessible to anyone worldwide! 🌍
