# Backend Deployment Guide

This guide covers deploying the SS CRUD Backend to various platforms.

## Prerequisites

1. **Supabase Setup**: Ensure your Supabase project is configured
2. **Environment Variables**: Set up production environment variables
3. **Database**: Ensure your database schema is applied

## Environment Variables

Copy `env.production.example` to `.env.production` and configure:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
```

## Deployment Options

### 1. Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set SUPABASE_URL=your_url
   # ... set other variables
   ```

### 2. Render

1. **Connect Repository** to Render
2. **Create Web Service**:
   - Build Command: `npm install`
   - Start Command: `npm run prod`
   - Environment: Node

3. **Set Environment Variables** in Render dashboard

### 3. Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Create and Deploy**:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SUPABASE_URL=your_url
   # ... set other variables
   ```

### 4. Docker Deployment

1. **Build Image**:
   ```bash
   docker build -t ss-crud-backend .
   ```

2. **Run Container**:
   ```bash
   docker run -p 3001:3001 \
     -e NODE_ENV=production \
     -e SUPABASE_URL=your_url \
     -e JWT_SECRET=your_secret \
     ss-crud-backend
   ```

### 5. Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel dashboard

## Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Secure session secret
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers (Helmet)
- [ ] Environment variables set
- [ ] Database connection secure

## Monitoring

### Health Check
Monitor your API health at: `https://your-domain.com/health`

### Logs
Check application logs for errors and performance issues.

### Database
Monitor Supabase dashboard for database performance and errors.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend domain is in allowed origins
2. **Database Connection**: Verify Supabase credentials
3. **File Uploads**: Check upload directory permissions
4. **Memory Issues**: Monitor memory usage and optimize if needed

### Performance Tips

1. **Enable Caching**: Consider Redis for session storage
2. **Database Indexing**: Ensure proper database indexes
3. **File Storage**: Use cloud storage (AWS S3, Supabase Storage) for uploads
4. **CDN**: Use CDN for static file delivery

## Support

For deployment issues, check:
- Platform-specific documentation
- Application logs
- Environment variable configuration
- Database connectivity 