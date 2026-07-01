/**
 * server/lib/s3.js — Family vault S3 presigned URLs (AW-04)
 */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.AWS_REGION || 'ap-south-1';
const bucket = process.env.S3_FAMILY_VAULT_BUCKET;

let client = null;

function getClient() {
    if (!client) client = new S3Client({ region });
    return client;
}

export function isS3Configured() {
    return Boolean(bucket);
}

export async function getUploadUrl(key, contentType, expiresIn = 300) {
    if (!bucket) throw new Error('S3_FAMILY_VAULT_BUCKET not configured');
    const cmd = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType || 'application/octet-stream',
    });
    return getSignedUrl(getClient(), cmd, { expiresIn });
}

export async function getDownloadUrl(key, expiresIn = 300) {
    if (!bucket) throw new Error('S3_FAMILY_VAULT_BUCKET not configured');
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(getClient(), cmd, { expiresIn });
}

export async function deleteObject(key) {
    if (!bucket) return;
    await getClient().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export function vaultKey(userId, filename) {
    const safe = String(filename || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
    return `vault/${userId}/${Date.now()}-${safe}`;
}
