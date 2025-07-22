#!/usr/bin/env node

/**
 * Storage Cleanup Script
 * Cleans up old files from Supabase Storage to manage storage usage
 */

const { supabaseAdmin } = require('../config/supabase');

// Configuration
const BUCKET_NAME = 'attendance-proofs';
const MAX_AGE_DAYS = 90; // Keep files for 90 days
const BATCH_SIZE = 50; // Process files in batches

async function cleanupStorage() {
  console.log('🧹 Starting storage cleanup...');
  
  try {
    // List all files in the bucket
    const { data: files, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        offset: 0
      });

    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }

    if (!files || files.length === 0) {
      console.log('✅ No files found in storage');
      return;
    }

    console.log(`📁 Found ${files.length} files in storage`);

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_AGE_DAYS);
    const cutoffTimestamp = cutoffDate.getTime();

    // Filter old files
    const oldFiles = files.filter(file => {
      // Extract timestamp from filename (format: timestamp-randomId.ext)
      const timestampMatch = file.name.match(/^(\d+)-/);
      if (!timestampMatch) return false;
      
      const fileTimestamp = parseInt(timestampMatch[1]);
      return fileTimestamp < cutoffTimestamp;
    });

    if (oldFiles.length === 0) {
      console.log('✅ No old files to delete');
      return;
    }

    console.log(`🗑️ Found ${oldFiles.length} old files to delete`);

    // Delete files in batches
    const fileNames = oldFiles.map(file => file.name);
    let deletedCount = 0;

    for (let i = 0; i < fileNames.length; i += BATCH_SIZE) {
      const batch = fileNames.slice(i, i + BATCH_SIZE);
      
      const { error: deleteError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove(batch);

      if (deleteError) {
        console.error(`❌ Error deleting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, deleteError);
      } else {
        deletedCount += batch.length;
        console.log(`✅ Deleted batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} files)`);
      }

      // Small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`🎉 Cleanup completed! Deleted ${deletedCount} old files`);
    console.log(`📊 Storage usage reduced by approximately ${deletedCount} files`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

// Get storage usage statistics
async function getStorageStats() {
  console.log('📊 Getting storage statistics...');
  
  try {
    const { data: files, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        offset: 0
      });

    if (error) {
      console.error('❌ Error getting storage stats:', error);
      return;
    }

    if (!files || files.length === 0) {
      console.log('📁 No files in storage');
      return;
    }

    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    // Group by month
    const filesByMonth = {};
    files.forEach(file => {
      const timestampMatch = file.name.match(/^(\d+)-/);
      if (timestampMatch) {
        const date = new Date(parseInt(timestampMatch[1]));
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        filesByMonth[monthKey] = (filesByMonth[monthKey] || 0) + 1;
      }
    });

    console.log(`📊 Storage Statistics:`);
    console.log(`   Total files: ${files.length}`);
    console.log(`   Total size: ${totalSizeMB} MB`);
    console.log(`   Files by month:`);
    
    Object.entries(filesByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, count]) => {
        console.log(`     ${month}: ${count} files`);
      });

  } catch (error) {
    console.error('❌ Error getting storage stats:', error);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'cleanup':
      await cleanupStorage();
      break;
    case 'stats':
      await getStorageStats();
      break;
    default:
      console.log('Usage: node cleanup-storage.js [cleanup|stats]');
      console.log('  cleanup - Delete old files (older than 90 days)');
      console.log('  stats   - Show storage statistics');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  cleanupStorage,
  getStorageStats
}; 