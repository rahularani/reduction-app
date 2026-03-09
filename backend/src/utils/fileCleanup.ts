/**
 * File Cleanup Utility
 * 
 * Provides utilities for cleaning up temporary files and resources
 * after validation operations, ensuring no orphaned files remain
 * when validation fails.
 * 
 * Requirements: 8.4 (Temporary data cleanup)
 */

import * as fs from 'fs/promises';
import { logger } from './logger.js';

/**
 * Delete a file from the filesystem
 * Handles errors gracefully and logs failures
 * 
 * @param filePath - Path to the file to delete
 * @returns Promise that resolves to true if deleted, false if failed
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    logger.info(`Successfully deleted file: ${filePath}`);
    return true;
  } catch (error) {
    // File might not exist or already deleted
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      logger.debug(`File not found (already deleted?): ${filePath}`);
      return true;
    }
    
    logger.error(`Failed to delete file: ${filePath}`, error);
    return false;
  }
}

/**
 * Clean up uploaded file if validation fails
 * This should be called in the validation middleware when an image
 * fails validation to prevent orphaned files
 * 
 * @param file - Multer file object
 * @returns Promise that resolves when cleanup is complete
 */
export async function cleanupFailedUpload(file: Express.Multer.File | undefined): Promise<void> {
  if (!file || !file.path) {
    return;
  }

  const deleted = await deleteFile(file.path);
  
  if (deleted) {
    logger.info(`Cleaned up failed upload: ${file.filename}`);
  } else {
    logger.warn(`Could not clean up failed upload: ${file.filename}`);
  }
}

/**
 * Clean up multiple files
 * Useful for batch operations or cleanup of multiple failed uploads
 * 
 * @param filePaths - Array of file paths to delete
 * @returns Promise that resolves to count of successfully deleted files
 */
export async function cleanupMultipleFiles(filePaths: string[]): Promise<number> {
  const results = await Promise.all(
    filePaths.map(path => deleteFile(path))
  );
  
  const successCount = results.filter(result => result).length;
  logger.info(`Cleaned up ${successCount}/${filePaths.length} files`);
  
  return successCount;
}
