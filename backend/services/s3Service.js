import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Only initialize S3Client if BUCKET_NAME is defined to avoid local runtime credential errors
let s3 = null;
if (BUCKET_NAME) {
  try {
    s3 = new S3Client({
      region: 'ap-south-1'
    });
  } catch (err) {
    console.warn('Failed to initialize AWS S3 Client:', err.message);
  }
}

/**
 * Generates a temporary secure presigned URL for direct client resume upload.
 * Falls back to local directory routing if AWS S3 is not configured.
 * 
 * @param {string} userId - ID of the authenticated user
 * @param {string} fileKey - Original name or unique identifier of the file
 * @param {string} contentType - MIME type of the file (e.g. 'application/pdf')
 * @returns {Promise<{uploadUrl: string, fileUrl: string, key: string}>}
 */
export const getUploadPresignedUrl = async (userId, fileKey, contentType, baseUrl = 'http://localhost:5002') => {
  const sanitizedFileKey = fileKey.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();

  if (!BUCKET_NAME || !s3) {
    // AWS is not configured. Use Local Directory Fallback
    console.info(`[Storage] S3 not configured. Using local directory upload fallback for user ${userId}.`);
    const secureKey = `local/users/${userId}/resumes/${timestamp}-${sanitizedFileKey}`;
    const uploadUrl = `${baseUrl}/api/placements/resumes/upload-local?key=${encodeURIComponent(secureKey)}`;
    const fileUrl = `${baseUrl}/api/placements/resumes/local-view?key=${encodeURIComponent(secureKey)}`;
    return {
      uploadUrl,
      fileUrl,
      key: secureKey
    };
  }

  // Standard AWS S3 Upload Ticket logic
  const secureKey = `users/${userId}/resumes/${timestamp}-${sanitizedFileKey}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: secureKey,
    ContentType: contentType,
  });

  // URL expires in 15 minutes (900 seconds)
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
  
  return { 
    uploadUrl, 
    fileUrl: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${secureKey}`, 
    key: secureKey 
  };
};

/**
 * Generates a temporary secure GET URL for downloading/viewing a file.
 * Falls back to local directory routing if AWS S3 is not configured.
 * 
 * @param {string} fileKey - The object key (e.g. 'users/123/resumes/filename.pdf')
 * @param {string} baseUrl - Dynamic host origin URL
 * @returns {Promise<string>} Dynamic view URL
 */
export const getDownloadPresignedUrl = async (fileKey, baseUrl = 'http://localhost:5002') => {
  if (fileKey && fileKey.startsWith('local/')) {
    return `${baseUrl}/api/placements/resumes/local-view?key=${encodeURIComponent(fileKey)}`;
  }

  if (!BUCKET_NAME || !s3) {
    return `${baseUrl}/api/placements/resumes/local-view?key=${encodeURIComponent(fileKey)}`;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  // URL expires in 15 minutes (900 seconds)
  return getSignedUrl(s3, command, { expiresIn: 900 });
};

/**
 * Deletes an object from the storage.
 * 
 * @param {string} fileKey - The key to delete
 * @returns {Promise<void>}
 */
export const deleteS3Object = async (fileKey) => {
  if (fileKey && fileKey.startsWith('local/')) {
    // Handled separately at the controller level for file system deletion
    return;
  }

  if (!BUCKET_NAME || !s3) {
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3.send(command);
};
