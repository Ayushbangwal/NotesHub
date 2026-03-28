import { v2 as cloudinary } from 'cloudinary';
import { generateFileHash } from '../middleware/upload.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
export const uploadToCloudinary = async (fileBuffer, originalName, folder = 'noteshub') => {
  try {
    // Generate unique filename
    const fileHash = generateFileHash(fileBuffer);
    const fileExtension = originalName.split('.').pop();
    const publicId = `${folder}/${fileHash}`;

    // Upload options
    const uploadOptions = {
      resource_type: 'auto',
      public_id: publicId,
      folder: folder,
      format: fileExtension,
      overwrite: true,
      invalidate: true
    };

    // Upload file
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      hash: fileHash
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from cloud storage');
  }
};

// Check if file exists in Cloudinary
export const checkFileExists = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result ? true : false;
  } catch (error) {
    if (error.http_code === 404) {
      return false;
    }
    throw error;
  }
};

export default cloudinary;
