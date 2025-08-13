# 🚀 Deploy TDL SMP Website to Railway

## Step-by-Step Railway Deployment Guide

### 📋 Prerequisites
- [x] Your TDL SMP website code (ready!)
- [ ] GitHub account
- [ ] Railway account
- [ ] Discord webhooks ready

---

## 🔧 Step 1: Push to GitHub

### 1.1 Initialize Git Repository
```bash
cd C:\Users\kimbe\Downloads\TDLWebsite
git init
git add .
git commit -m "Initial commit: TDL SMP website with ban appeals and player reports"
```

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Name it: `tdl-smp-website`
4. Make it **Public** (for free Railway deployment)
5. Don't initialize with README (you already have one)
6. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/tdl-smp-website.git
git branch -M main
git push -u origin main
```

---

## 🚂 Step 2: Deploy to Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `tdl-smp-website` repository
4. Click "Deploy Now"

### 2.3 Railway Auto-Detection
Railway will automatically:
- ✅ Detect Node.js project
- ✅ Run `npm install`
- ✅ Use `railway.json` configuration
- ✅ Start with `node start-prod.js`

---

## ⚙️ Step 3: Configure Environment Variables

In your Railway project dashboard:

1. Click on your service
2. Go to "Variables" tab
3. Add these environment variables:

```env
NODE_ENV=production
PORT=3000
SITE_NAME=TDL SMP
SITE_DESCRIPTION=The ultimate Minecraft SMP experience
ADMIN_USERNAME=TDLAdmin
ADMIN_PASSWORD=TDL_Super_Secure_Admin_Password_2024!
SESSION_SECRET=super_secure_random_string_here_make_it_long_and_complex
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_APPEAL_WEBHOOK
REPORTS_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_REPORTS_WEBHOOK
```

### 🔐 Important Security Notes:
- **SESSION_SECRET**: Generate a long, random string (50+ characters)
- **ADMIN_PASSWORD**: Use a strong, unique password
- **Webhooks**: Get these from your Discord server settings

---

## 🌐 Step 4: Get Your Public URL

After deployment completes:

1. Railway provides a free subdomain like:
   ```
   https://tdl-smp-website-production.up.railway.app
   ```

2. **Test your live website:**
   - Homepage: `https://your-url.up.railway.app/`
   - Ban Appeals: `https://your-url.up.railway.app/appeal`
   - Player Reports: `https://your-url.up.railway.app/report`
   - Admin Panel: `https://your-url.up.railway.app/admin`

---

## 🎯 Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Railway dashboard, go to "Settings"
2. Click "Domains"
3. Add your custom domain (e.g., `tdlsmp.com`)
4. Update your domain's DNS records as shown

### 5.2 SSL Certificate
Railway automatically provides free SSL certificates for all domains!

---

## ✅ Step 6: Verify Everything Works

### Test Checklist:
- [ ] Website loads at your Railway URL
- [ ] Navigation works (all tabs)
- [ ] Ban appeal form submits successfully
- [ ] Player report form accepts video uploads
- [ ] Discord webhooks send messages
- [ ] Admin login works
- [ ] Admin dashboard shows appeals/reports
- [ ] Mobile responsive design works

---

## 🔧 Railway Features for Your Website

### ✅ What Works Perfectly:
- **File Uploads**: Video files for player reports
- **SQLite Database**: Persistent storage for appeals/reports
- **Sessions**: Admin login sessions persist
- **Environment Variables**: Secure configuration
- **Auto-Deploy**: Updates when you push to GitHub
- **Free SSL**: HTTPS automatically enabled
- **99.9% Uptime**: Reliable hosting

### 📊 Railway Free Tier Limits:
- **Execution Time**: 500 hours/month (plenty for your site)
- **Memory**: 512MB (perfect for your app)
- **Storage**: 1GB (good for SQLite + uploads)
- **Bandwidth**: 100GB/month

---

## 🚀 Going Live Commands

Run these commands to deploy:

```bash
# 1. Commit any final changes
git add .
git commit -m "Ready for Railway deployment"
git push

# 2. Railway will auto-deploy from GitHub
# 3. Check Railway dashboard for deployment status
# 4. Test your live URL!
```

---

## 🎮 Your TDL SMP Website Will Be Live!

Once deployed, your Minecraft community can:
- ✅ Submit ban appeals at `/appeal`
- ✅ Report players with video proof at `/report`
- ✅ Join Discord community
- ✅ Admins manage everything at `/admin`

**Your website will be accessible worldwide 24/7!** 🌍

---

## 🆘 Troubleshooting

### Common Issues:
1. **Build Failed**: Check Railway logs for npm install errors
2. **Environment Variables**: Make sure all required vars are set
3. **Discord Webhooks**: Test webhook URLs in Discord
4. **File Uploads**: Railway handles this automatically
5. **Database**: SQLite files persist on Railway

### Support:
- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

---

**Ready to deploy? Let's get your TDL SMP website live!** 🚀
