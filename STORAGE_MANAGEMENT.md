# ☁️ Cloud Storage Management Guide

Your backend now uses **Supabase Storage** for all file uploads, eliminating local storage concerns.

## 🎯 **Benefits of Cloud Storage**

### ✅ **No Local Storage Issues:**
- **Unlimited storage** - No server disk space concerns
- **Automatic scaling** - Handles any number of uploads
- **Global CDN** - Fast file delivery worldwide
- **Automatic backups** - Built-in redundancy
- **Cost effective** - Pay only for what you use

### ✅ **Security & Performance:**
- **SSL/TLS encryption** - Secure file transfer
- **Access control** - Fine-grained permissions
- **Image optimization** - Automatic resizing
- **Cache headers** - Better performance

## 📁 **Storage Structure**

```
attendance-proofs/
├── 1753179217147-abc123.webp
├── 1753179233591-def456.jpg
├── 1753179246370-ghi789.png
└── ...
```

**File naming convention:**
- `{timestamp}-{randomId}.{extension}`
- Example: `1753179217147-abc123.webp`

## 🔧 **Storage Configuration**

### **File Limits:**
- **Maximum size:** 5MB per file
- **Allowed types:** JPEG, JPG, PNG, WebP
- **Retention:** 90 days (configurable)

### **Bucket Settings:**
- **Bucket name:** `attendance-proofs`
- **Public access:** Enabled (for attendance proofs)
- **RLS policies:** Configured for security

## 🛠️ **Management Commands**

### **View Storage Statistics:**
```bash
npm run storage:stats
```

**Output:**
```
📊 Storage Statistics:
   Total files: 150
   Total size: 45.67 MB
   Files by month:
     2025-07: 45 files
     2025-08: 105 files
```

### **Clean Up Old Files:**
```bash
npm run storage:cleanup
```

**What it does:**
- Deletes files older than 90 days
- Processes in batches of 50 files
- Shows progress and results

### **Manual Cleanup:**
```bash
# Delete specific file
curl -X DELETE "https://your-api.com/api/upload/file/filename.webp" \
  -H "Authorization: Bearer YOUR_TOKEN"

# List all files (admin only)
curl "https://your-api.com/api/upload/files" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 **Monitoring Storage Usage**

### **Supabase Dashboard:**
1. Go to your Supabase project
2. Navigate to **Storage** → **Buckets**
3. Click on `attendance-proofs` bucket
4. View file count and total size

### **API Endpoints:**
```bash
# Get file URL
GET /api/upload/file/:filename

# List files (admin)
GET /api/upload/files

# Delete file (admin)
DELETE /api/upload/file/:filename
```

## 🔄 **Automated Cleanup**

### **Set up Cron Job (VPS):**
```bash
# Add to crontab
0 2 * * 0 cd /var/www/tutor-app-backend/backend-supabase && npm run storage:cleanup
```

### **Using PM2 Cron:**
```bash
# Install PM2 cron
pm2 install pm2-cron

# Add cron job
pm2 cron "0 2 * * 0" "cd /var/www/tutor-app-backend/backend-supabase && npm run storage:cleanup"
```

## 💰 **Cost Management**

### **Supabase Storage Pricing:**
- **Free tier:** 1GB storage
- **Pro tier:** $25/month for 100GB
- **Pay-as-you-go:** $0.021 per GB

### **Optimization Tips:**
1. **Compress images** before upload
2. **Use WebP format** for better compression
3. **Set appropriate file size limits**
4. **Regular cleanup** of old files
5. **Monitor usage** monthly

## 🛡️ **Security Best Practices**

### **File Validation:**
- ✅ File type checking
- ✅ File size limits
- ✅ Malware scanning (optional)

### **Access Control:**
- ✅ Admin-only deletion
- ✅ Public read access for proofs
- ✅ Secure upload endpoints

### **Data Protection:**
- ✅ Automatic encryption
- ✅ Secure file URLs
- ✅ Access logging

## 🆘 **Troubleshooting**

### **Common Issues:**

**Upload fails:**
```bash
# Check file size and type
# Verify Supabase credentials
# Check network connectivity
```

**File not accessible:**
```bash
# Verify bucket permissions
# Check file exists in storage
# Validate URL format
```

**Storage quota exceeded:**
```bash
# Run cleanup: npm run storage:cleanup
# Upgrade Supabase plan
# Optimize file sizes
```

### **Emergency Cleanup:**
```bash
# Delete all files (use with caution)
node -e "
const { supabaseAdmin } = require('./config/supabase');
supabaseAdmin.storage.from('attendance-proofs').list('').then(({data}) => {
  if (data && data.length > 0) {
    const files = data.map(f => f.name);
    supabaseAdmin.storage.from('attendance-proofs').remove(files);
  }
});
"
```

## 📈 **Performance Optimization**

### **CDN Benefits:**
- **Global distribution** - Files served from nearest location
- **Automatic caching** - Faster subsequent loads
- **Bandwidth optimization** - Reduced server load

### **Image Optimization:**
- **WebP format** - 25-35% smaller than JPEG
- **Responsive images** - Different sizes for different devices
- **Lazy loading** - Load images only when needed

## 🎉 **Migration Complete!**

Your backend now uses **100% cloud storage** with:
- ✅ **Zero local storage** concerns
- ✅ **Automatic file management**
- ✅ **Global CDN delivery**
- ✅ **Built-in security**
- ✅ **Cost-effective scaling**

No more worrying about server disk space! 🚀 