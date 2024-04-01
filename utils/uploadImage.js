const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(image) {
  try{
    const result = await cloudinary.uploader.upload(image);
    return result.secure_url;
  } catch(err) {
    console.error(err);
    return null;
  }
}

module.exports = { uploadImage };