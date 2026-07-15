const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'gwc8t3re', 
  api_key: '681281257956792', 
  api_secret: '5HFdL6vBF5kb9RnY1v3RtQ9Zt-E' 
});

async function run() {
  try {
    console.log('Uploading image...');
    // 2. Upload an image
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { public_id: 'sample_test_image' }
    );
    
    console.log('\n--- Upload Results ---');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // 3. Get image details
    console.log('\n--- Image Metadata ---');
    console.log('Width:', uploadResult.width, 'px');
    console.log('Height:', uploadResult.height, 'px');
    console.log('Format:', uploadResult.format);
    console.log('File size:', uploadResult.bytes, 'bytes');

    // 4. Transform the image
    // f_auto: Automatically selects the most efficient image format (e.g., WebP, AVIF) based on the browser.
    // q_auto: Automatically adjusts the image quality to reduce file size without visible degradation.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log('\n--- Transformation ---');
    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(transformedUrl);

  } catch (error) {
    console.error('Error during Cloudinary execution:', error);
  }
}

run();
