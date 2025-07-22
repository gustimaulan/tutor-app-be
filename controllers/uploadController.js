const { supabase, supabaseAdmin } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

const uploadFile = async (req, res) => {
  let localFilePath = null;
  
  try {
    console.log('Upload request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      } : null,
      body: req.body
    });

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const { studentName, date } = req.body;
    localFilePath = file.path;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.' 
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      });
    }

    // Generate unique filename with better structure
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(file.originalname);
    const fileName = `attendance-proofs/${timestamp}-${randomId}${fileExtension}`;
    
    console.log('Attempting to upload to Supabase Storage:', {
      fileName,
      bucket: 'attendance-proofs',
      fileSize: file.size,
      fileType: file.mimetype
    });
    
    // Read file buffer
    const fileBuffer = fs.readFileSync(file.path);
    
    // Upload file to Supabase Storage using admin client to bypass RLS
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('attendance-proofs')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      console.error('Upload error details:', {
        message: uploadError.message,
        details: uploadError.details,
        hint: uploadError.hint
      });
      return res.status(500).json({ 
        error: 'Failed to upload file to cloud storage: ' + uploadError.message 
      });
    }

    // Get public URL using regular client
    const { data: { publicUrl } } = supabase.storage
      .from('attendance-proofs')
      .getPublicUrl(fileName);

    console.log('File uploaded successfully:', {
      fileName,
      publicUrl,
      fileSize: file.size
    });

    // Clean up local file immediately
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting local file:', err);
      } else {
        console.log('Local file cleaned up successfully');
      }
    });

    res.json({
      message: 'File uploaded successfully to cloud storage',
      url: publicUrl,
      file_name: fileName,
      file_size: file.size,
      file_type: file.mimetype
    });
  } catch (error) {
    console.error('Upload file error:', error);
    
    // Clean up local file on error
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (err) => {
        if (err) console.error('Error deleting local file on error:', err);
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to upload file. Please try again.' 
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { file_name } = req.params;

    if (!file_name) {
      return res.status(400).json({ error: 'File name is required' });
    }

    console.log('Attempting to delete file from Supabase Storage:', file_name);

    const { error } = await supabaseAdmin.storage
      .from('attendance-proofs')
      .remove([file_name]);

    if (error) {
      console.error('Delete file error:', error);
      return res.status(500).json({ 
        error: 'Failed to delete file from cloud storage: ' + error.message 
      });
    }

    console.log('File deleted successfully from cloud storage:', file_name);

    res.json({ 
      message: 'File deleted successfully from cloud storage',
      file_name: file_name
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file. Please try again.' 
    });
  }
};

const getFileUrl = async (req, res) => {
  try {
    const { file_name } = req.params;

    if (!file_name) {
      return res.status(400).json({ error: 'File name is required' });
    }

    console.log('Getting public URL for file:', file_name);

    const { data: { publicUrl } } = supabase.storage
      .from('attendance-proofs')
      .getPublicUrl(file_name);

    res.json({ 
      url: publicUrl,
      file_name: file_name
    });
  } catch (error) {
    console.error('Get file URL error:', error);
    res.status(500).json({ 
      error: 'Failed to get file URL. Please try again.' 
    });
  }
};

// New function to list files (for admin use)
const listFiles = async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from('attendance-proofs')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('List files error:', error);
      return res.status(500).json({ 
        error: 'Failed to list files: ' + error.message 
      });
    }

    res.json({
      files: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ 
      error: 'Failed to list files. Please try again.' 
    });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
  listFiles
}; 