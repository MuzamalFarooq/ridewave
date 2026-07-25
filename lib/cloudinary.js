import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a base64 or file buffer to Cloudinary
 */
export const uploadImage = async (file, folder = 'ridewave') => {
  try {
    const result = await cloudinary.v2.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { format: 'webp' },
      ],
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (files, folder = 'ridewave') => {
  const uploads = await Promise.all(files.map((file) => uploadImage(file, folder)));
  return uploads;
};

/**
 * Delete an image from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

export default cloudinary.v2;
