const uploadONCloudinary = async (file, type = 'template') => {
  setUploading(true);
  setUploadProgress(0);
  
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  console.log('🔧 Upload Configuration:', {
    cloudName,
    uploadPreset,
    file: file.name,
    size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
    type: file.type
  });

  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    const error = new Error('Please upload a valid image (JPEG, PNG, WebP, GIF)');
    setUploading(false);
    throw error;
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    const error = new Error('File size too large. Maximum 10MB allowed.');
    setUploading(false);
    throw error;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', type === 'template' ? 'templates' : 'freelancers');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('📡 Response Status:', response.status);
    
    const responseText = await response.text();
    console.log('📡 Response Text:', responseText);

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || responseText;
      } catch (e) {
        errorMessage = responseText || `HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    console.log('✅ Upload Successful:', data);
    
    setUploading(false);
    return data.secure_url;
  } catch (error) {
    console.error('❌ Upload Error:', error);
    setUploading(false);
    throw new Error(`Upload failed: ${error.message}`);
  }
};
export { uploadONCloudinary };