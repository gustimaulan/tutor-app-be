const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { uploadFile, deleteFile, getFileUrl, listFiles } = require('../controllers/uploadController');

// Upload file to Supabase Storage (protected)
router.post('/upload-proof', requireAuth, upload.single('file'), handleMulterError, uploadFile);

// Get file URL (protected)
router.get('/file/:file_name', requireAuth, getFileUrl);

// Delete file (protected)
router.delete('/file/:file_name', requireAuth, deleteFile);

// List files (admin only)
router.get('/files', requireAuth, listFiles);

module.exports = router; 