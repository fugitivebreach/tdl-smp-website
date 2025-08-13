# 🎮 TDL SMP Website

A modern, full-featured website for the TDL SMP Minecraft server with ban appeals, player reports, and admin management.

## ✨ Features

- 📝 **Ban Appeal System** - Players can submit appeals with detailed forms
- 🚨 **Player Report System** - Video upload support for reporting rule violations
- 👨‍💼 **Admin Dashboard** - Secure admin panel for managing appeals and reports
- 🔗 **Discord Integration** - Separate webhooks for appeals and reports
- 🎨 **Modern Design** - Black/dark crimson theme, fully responsive
- 🔒 **Security** - Rate limiting, input validation, secure sessions
- 💾 **SQLite Database** - No external database required

## 🚀 Quick Start

### Development
```bash
npm install
node start-dev.js
```
Visit: `http://localhost:3001`

### Production
```bash
npm install
node start-prod.js
```
Visit: `http://localhost:3000`

## 🌐 Deploy to Railway

This website is optimized for Railway deployment:

1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy automatically!

## 🔧 Environment Variables

Required for production:

```env
NODE_ENV=production
PORT=3000
SITE_NAME=TDL SMP
SITE_DESCRIPTION=The ultimate Minecraft SMP experience
ADMIN_USERNAME=TDLAdmin
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=your_session_secret
DISCORD_WEBHOOK_URL=your_appeal_webhook
REPORTS_WEBHOOK_URL=your_reports_webhook
```

## 📱 Pages

- **Homepage** (`/`) - Welcome and server information
- **Ban Appeals** (`/appeal`) - Submit ban appeal requests
- **Player Reports** (`/report`) - Report rule violations with video proof
- **SMP Info** (`/smp-info`) - Server information and rules
- **Community** (`/community`) - Community links and Discord
- **Admin Panel** (`/admin`) - Secure admin dashboard

## 🎯 Admin Features

- View all ban appeals and reports
- Approve/deny appeals with status tracking
- Secure login with session management
- Real-time Discord notifications

## 🔗 Discord Community

Join our Discord: https://discord.gg/zvY6235WC9

---

Built with ❤️ for the TDL SMP community on all devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite with Sequelize
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating, vanilla JavaScript
- **Styling**: Custom CSS with modern design principles
- **Security**: Helmet, rate limiting, session management

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Discord webhook URL (for appeal notifications)

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   copy .env.example .env
   ```

4. Update `.env` file with your configuration:
   - Set your MongoDB connection strings
   - Add your Discord webhook URL
   - Configure admin credentials
   - Set a secure session secret

### Running the Application

#### Development Mode
```bash
npm run dev
# or
node start-dev.js
```
- Runs on port 3001 by default
- Uses development MongoDB database
- Shows "DEV" badge in navigation

#### Production Mode
```bash
npm start
# or
node start-prod.js
```
- Runs on port 3000 by default
- Uses production MongoDB database

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | Production MongoDB connection string | Yes |
| `MONGODB_URI_DEV` | Development MongoDB connection string | Yes |
| `PORT` | Production server port (default: 3000) | No |
| `DEV_PORT` | Development server port (default: 3001) | No |
| `SESSION_SECRET` | Secret key for session encryption | Yes |
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |
| `DISCORD_WEBHOOK_URL` | Discord webhook for appeal notifications | Yes |
| `SITE_NAME` | Website title (default: TDL SMP) | No |

### Discord Webhook Setup

1. Go to your Discord server settings
2. Navigate to Integrations → Webhooks
3. Create a new webhook
4. Copy the webhook URL and add it to your `.env` file

## Website Structure

### Pages

- **Homepage** (`/`): Welcome page with server information and call-to-action
- **Appeal** (`/appeal`): Application form for joining the server
- **SMP Info** (`/smp-info`): Detailed server information, rules, and features
- **Community** (`/community`): Community guidelines, staff info, and social links
- **Admin Login** (`/admin`): Secure admin authentication
- **Admin Dashboard** (`/admin/dashboard`): Appeal management interface

### Navigation

The website features a top-right navigation bar with four main tabs:
- HOMEPAGE
- APPEAL  
- SMP INFO
- COMMUNITY

## Admin Features

### Default Admin Credentials
- **Username**: `TDLAdmin`
- **Password**: `TDL_Super_Secure_Admin_Password_2024!`

⚠️ **Important**: Change the default password in production!

### Admin Dashboard Features
- View all submitted appeals
- Filter appeals by status (pending, approved, denied)
- Review individual applications with full details
- Approve or deny applications
- Real-time statistics display

## Appeal System

### Application Process
1. Users fill out the appeal form with:
   - Minecraft username
   - Discord username
   - Age
   - Reason for joining
   - Minecraft experience level
   - Agreement to rules
   - Optional additional information

2. Form submission triggers:
   - Database storage
   - Discord webhook notification with embedded appeal details
   - Confirmation message to user

3. Admin review process:
   - Appeals appear in admin dashboard
   - Admins can view full details
   - Status updates (approve/deny)
   - Timestamps and reviewer tracking

## Security Features

- **Helmet**: Security headers protection
- **Rate Limiting**: Prevents spam and abuse
- **Session Management**: Secure admin authentication
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Cross-origin request security
- **Environment Separation**: Isolated prod/dev configurations

## Customization

### Colors
The website uses CSS custom properties for easy color customization:
- `--primary-black`: Main background color
- `--dark-crimson`: Primary accent color
- `--light-crimson`: Secondary accent color

### Content
- Update server information in the EJS templates
- Modify social media links in the footer
- Customize appeal form questions as needed

## Deployment

### Production Checklist
- [ ] Update MongoDB connection string
- [ ] Set secure session secret
- [ ] Change default admin password
- [ ] Configure Discord webhook
- [ ] Set up SSL/HTTPS
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up process manager (PM2)

### Recommended Hosting
- **VPS/Dedicated Server**: Full control and customization
- **Cloud Platforms**: Heroku, DigitalOcean, AWS
- **Database**: MongoDB Atlas for managed database

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify environment configuration
3. Ensure MongoDB connection is working
4. Test Discord webhook functionality

## License

MIT License - Feel free to modify and use for your own Minecraft server!

---

**TDL SMP** - The Ultimate Minecraft SMP Experience
