const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// SQLite Database Setup
const isDev = process.env.NODE_ENV === 'development';
const dbPath = isDev ? 'tdl_smp_dev.db' : 'tdl_smp.db';
const db = new sqlite3.Database(dbPath);

// Initialize SQLite database and create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS appeals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    minecraftUsername TEXT NOT NULL,
    discordUsername TEXT NOT NULL,
    banType TEXT NOT NULL,
    banReason TEXT NOT NULL,
    banDate TEXT NOT NULL,
    appealReason TEXT NOT NULL,
    whatHappened TEXT NOT NULL,
    whyUnban TEXT NOT NULL,
    rulesUnderstood INTEGER NOT NULL DEFAULT 0,
    additionalInfo TEXT,
    status TEXT DEFAULT 'pending',
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewedAt DATETIME,
    reviewedBy TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerIdentifier TEXT NOT NULL,
    videoProofPath TEXT NOT NULL,
    reportReason TEXT NOT NULL,
    additionalInfo TEXT,
    truthfulReport INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewedAt DATETIME,
    reviewedBy TEXT
  )
`);

console.log(`📊 SQLite database connected: ${dbPath}`);

// Discord OAuth2 Configuration
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || (isDev ? 'http://localhost:3001/auth/discord/callback' : '/auth/discord/callback'),
    scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
    // Store user info in session
    const user = {
        id: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        email: profile.email,
        tag: `${profile.username}#${profile.discriminator}`
    };
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Store the original URL to redirect back after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
}

// Discord OAuth2 Routes
app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', 
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to original page or home
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev,
    returnTo: req.query.returnTo || '/'
  });
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev,
    user: req.user || null
  });
});

app.get('/appeal', requireAuth, (req, res) => {
  res.render('appeal', { 
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev,
    user: req.user
  });
});

app.get('/report', requireAuth, (req, res) => {
  res.render('report', { 
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev,
    user: req.user
  });
});

app.get('/smp-info', (req, res) => {
  res.render('smp-info', { 
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev,
    user: req.user || null
  });
});

app.get('/community', (req, res) => {
  res.render('community', { 
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev,
    user: req.user || null
  });
});

// Ban Appeal submission
app.post('/submit-appeal', requireAuth, async (req, res) => {
  try {
    console.log('=== FORM DATA RECEIVED ===');
    console.log('Full req.body:', req.body);
    console.log('========================');
    
    const { minecraftUsername, banType, banReason, banDate, appealReason, whatHappened, whyUnban, rulesUnderstood, additionalInfo } = req.body;
    
    // Use authenticated Discord user info
    const discordUsername = req.user.tag;

    console.log('Extracted fields:');
    console.log('minecraftUsername:', minecraftUsername);
    console.log('discordUsername:', discordUsername);
    console.log('banType:', banType);
    console.log('banReason:', banReason);
    console.log('banDate:', banDate);
    console.log('appealReason:', appealReason);
    console.log('whatHappened:', whatHappened);
    console.log('whyUnban:', whyUnban);
    console.log('rulesUnderstood:', rulesUnderstood);

    // Validate required fields
    if (!minecraftUsername || !discordUsername || !banType || !banReason || !banDate || !appealReason || !whatHappened || !whyUnban) {
      console.log('VALIDATION FAILED - Missing required fields');
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Validate checkbox separately (checkboxes don't send value when unchecked)
    if (!rulesUnderstood) {
      return res.status(400).json({ error: 'You must confirm that you understand the rules' });
    }

    // Create new ban appeal in SQLite
    const appealId = await new Promise((resolve, reject) => {
      const stmt = db.prepare(`INSERT INTO appeals (
        minecraftUsername, discordUsername, banType, banReason, banDate, 
        appealReason, whatHappened, whyUnban, rulesUnderstood, additionalInfo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      stmt.run(
        minecraftUsername,
        discordUsername,
        banType,
        banReason,
        banDate,
        appealReason,
        whatHappened,
        whyUnban,
        rulesUnderstood === 'on' ? 1 : 0,
        additionalInfo || null,
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ Appeal created with ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });

    // Send Discord webhook
    if (process.env.DISCORD_WEBHOOK_URL) {
      const embed = {
        title: '⚖️ New Ban Appeal Submitted',
        color: 0x8B0000, // Dark crimson red
        fields: [
          { name: '🎯 Minecraft Username', value: minecraftUsername, inline: true },
          { name: '💬 Discord Username', value: discordUsername, inline: true },
          { name: '🚫 Ban Type', value: banType === 'permanent' ? 'Permanent Ban' : 'Temporary Ban', inline: true },
          { name: '📅 Ban Date', value: new Date(banDate).toLocaleDateString(), inline: true },
          { name: '❓ Original Ban Reason', value: banReason, inline: false },
          { name: '📝 Appeal Reason', value: appealReason, inline: false },
          { name: '📖 What Happened', value: whatHappened, inline: false },
          { name: '🔄 Why Should You Be Unbanned', value: whyUnban, inline: false },
          { name: '📋 Rules Understood', value: rulesUnderstood ? '✅ Yes' : '❌ No', inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: `Appeal ID: ${appealId}`
        }
      };

      if (additionalInfo) {
        embed.fields.push({ name: '💭 Additional Information', value: additionalInfo, inline: false });
      }

      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        embeds: [embed]
      });
    }

    res.json({ success: true, message: 'Ban appeal submitted successfully!' });
  } catch (error) {
    console.error('Appeal submission error:', error);
    res.status(500).json({ error: 'Failed to submit appeal. Please try again.' });
  }
});

// Player report submission
app.post('/submit-report', requireAuth, upload.single('videoProof'), async (req, res) => {
  try {
    const { playerIdentifier, reportReason, additionalInfo, truthfulReport } = req.body;

    console.log('=== REPORT DATA RECEIVED ===');
    console.log('Full req.body:', req.body);
    console.log('File:', req.file);
    console.log('========================');

    // Validate required fields
    if (!playerIdentifier || !reportReason || !req.file) {
      return res.status(400).json({ error: 'All required fields must be filled and video proof must be uploaded' });
    }

    // Validate checkbox separately
    if (!truthfulReport) {
      return res.status(400).json({ error: 'You must confirm that this report is truthful' });
    }

    // Create new player report in SQLite
    const reportId = await new Promise((resolve, reject) => {
      const stmt = db.prepare(`INSERT INTO reports (
        playerIdentifier, videoProofPath, reportReason, additionalInfo, truthfulReport
      ) VALUES (?, ?, ?, ?, ?)`);
      
      stmt.run(
        playerIdentifier,
        req.file.path,
        reportReason,
        additionalInfo || null,
        truthfulReport === 'on' ? 1 : 0,
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ Report created with ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });

    // Send Discord webhook for reports
    if (process.env.REPORTS_WEBHOOK_URL) {
      const embed = {
        title: '🚨 New Player Report',
        color: 0xff4444, // Red color for reports
        fields: [
          {
            name: '👤 Reported Player',
            value: playerIdentifier,
            inline: true
          },
          {
            name: '📹 Video Proof',
            value: `File: ${req.file.filename}\nSize: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
            inline: true
          },
          {
            name: '📝 Report Details',
            value: reportReason.length > 1000 ? reportReason.substring(0, 1000) + '...' : reportReason,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: `Report ID: ${reportId}`
        }
      };

      if (additionalInfo) {
        embed.fields.push({
          name: '📋 Additional Information',
          value: additionalInfo.length > 500 ? additionalInfo.substring(0, 500) + '...' : additionalInfo,
          inline: false
        });
      }

      try {
        await axios.post(process.env.REPORTS_WEBHOOK_URL, {
          embeds: [embed]
        });
        console.log('✅ Report webhook sent successfully');
      } catch (webhookError) {
        console.error('❌ Report webhook failed:', webhookError.message);
      }
    }

    res.json({ success: true, message: 'Player report submitted successfully!' });
  } catch (error) {
    console.error('Report submission error:', error);
    res.status(500).json({ error: 'Failed to submit report. Please try again.' });
  }
});

// Admin login page
app.get('/admin', (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin-login', { 
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev 
  });
});

// Admin login handler
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      res.redirect('/admin/dashboard');
    } else {
      res.render('admin-login', { 
        error: 'Invalid credentials',
        siteName: process.env.SITE_NAME || 'TDL SMP',
        isDev: isDev 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).send('Server error');
  }
});

// Admin dashboard
app.get('/admin/dashboard', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/admin');
  }

  try {
    // Get appeals from SQLite database
    const appeals = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM appeals ORDER BY submittedAt DESC', (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          console.log(`📊 Found ${rows.length} appeals in database`);
          // Convert SQLite rows to match the expected format
          const formattedAppeals = rows.map(row => ({
            ...row,
            _id: row.id,
            rulesUnderstood: row.rulesUnderstood === 1,
            submittedAt: row.submittedAt,
            reviewedAt: row.reviewedAt,
            banDate: row.banDate
          }));
          resolve(formattedAppeals);
        }
      });
    });
    
    res.render('admin-dashboard', { 
      appeals,
      siteName: process.env.SITE_NAME || 'TDL SMP',
      isDev: isDev 
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server error');
  }
});

// Admin appeal review
app.post('/admin/review/:id', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { status } = req.body;
    const appealId = req.params.id;
    
    // Update appeal status in SQLite
    await new Promise((resolve, reject) => {
      const stmt = db.prepare(`UPDATE appeals SET 
        status = ?, 
        reviewedAt = datetime('now'), 
        reviewedBy = ? 
        WHERE id = ?`);
      
      stmt.run(status, 'TDLAdmin', appealId, function(err) {
        if (err) {
          console.error('Update error:', err);
          reject(err);
        } else {
          console.log(`✅ Appeal ${appealId} updated to status: ${status}`);
          resolve();
        }
      });
    });
    
    // Get the updated appeal
    const appeal = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM appeals WHERE id = ?', [appealId], (err, row) => {
        if (err) {
          console.error('Fetch error:', err);
          reject(err);
        } else {
          resolve({
            ...row,
            _id: row.id,
            rulesUnderstood: row.rulesUnderstood === 1,
            submittedAt: row.submittedAt,
            reviewedAt: row.reviewedAt,
            banDate: row.banDate
          });
        }
      });
    });

    res.json({ success: true, appeal });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to update appeal' });
  }
});

// Admin logout
app.post('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    siteName: process.env.SITE_NAME || 'TDL SMP',
    isDev: isDev 
  });
});

// Start server
const port = isDev ? (process.env.DEV_PORT || 3001) : (process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`🚀 TDL SMP ${isDev ? 'DEV' : 'PRODUCTION'} server running on port ${port}`);
  console.log(`📊 SQLite database ready: ${dbPath}`);
});
