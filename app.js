const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
require('dotenv').config({ path: envFile });

// Import routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const studentsRoutes = require('./routes/students');
const uploadRoutes = require('./routes/upload');

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            /^https:\/\/.*\.ngrok-free\.app$/, // Allow any ngrok-free.app subdomain
            /^https:\/\/.*\.ngrok\.io$/, // Allow any ngrok.io subdomain
            /^https:\/\/.*\.sigmath\.net$/ // Allow any sigmath.net subdomain
        ];
        
        // Add production domains
        if (NODE_ENV === 'production') {
            allowedOrigins.push(
                /^https:\/\/.*\.vercel\.app$/, // Vercel deployments
                /^https:\/\/.*\.netlify\.app$/, // Netlify deployments
                /^https:\/\/.*\.railway\.app$/, // Railway deployments
                /^https:\/\/.*\.render\.com$/, // Render deployments
                /^https:\/\/.*\.herokuapp\.com$/ // Heroku deployments
            );
        }
        
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return origin === allowed;
            }
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Enable JSON parsing for request body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware with production settings
app.use(session({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
        sameSite: NODE_ENV === 'production' ? 'strict' : 'lax'
    },
    name: 'sessionId' // Change default session name for security
}));

// Create uploads directory if it doesn't exist (for temporary file processing)
const fs = require('fs');
const uploadPath = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Note: We don't serve static files from /uploads anymore
// All files are stored in Supabase Storage and served via CDN

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', studentsRoutes);
app.use('/api', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    // Don't leak error details in production
    const errorMessage = NODE_ENV === 'development' ? error.message : 'Something went wrong';
    const errorStack = NODE_ENV === 'development' ? error.stack : undefined;
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: errorMessage,
        ...(errorStack && { stack: errorStack })
    });
});

module.exports = app; 