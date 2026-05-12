import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Client automatically inherits credentials from the Lambda execution role in AWS
// and from the local environment/credentials file in development.
const s3 = new S3Client({
  region: 'ap-south-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Generates a temporary secure presigned URL for direct client S3 upload.
 * 
 * @param {string} userId - ID of the authenticated user
 * @param {string} fileKey - Original name or unique identifier of the file
 * @param {string} contentType - MIME type of the file (e.g. 'application/pdf')
 * @returns {Promise<{uploadUrl: string, fileUrl: string, key: string}>}
 */
export const getUploadPresignedUrl = async (userId, fileKey, contentType) => {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not defined.');
  }

  // Ensure key name is secure and isolated per user
  const sanitizedFileKey = fileKey.replace(/[^a-zA-Z0-9.-]/g, '_');
  const secureKey = `users/${userId}/resumes/${Date.now()}-${sanitizedFileKey}`;
  
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
 * Generates a temporary secure GET presigned URL for downloading/viewing a file from S3.
 * 
 * @param {string} fileKey - The S3 object key (e.g. 'users/123/resumes/filename.pdf')
 * @returns {Promise<string>} Dynamic 15-minute presigned GET URL
 */
export const getDownloadPresignedUrl = async (fileKey) => {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not defined.');
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  // URL expires in 15 minutes (900 seconds)
  return getSignedUrl(s3, command, { expiresIn: 900 });
};

/**
 * Deletes an object from the S3 bucket.
 * 
 * @param {string} fileKey - The S3 object key to delete
 * @returns {Promise<void>}
 */
export const deleteS3Object = async (fileKey) => {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not defined.');
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3.send(command);
};
