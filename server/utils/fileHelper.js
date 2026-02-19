const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  try {
    if (!filePath) return;
    
    // Remove leading slash if present
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const fullPath = path.join(__dirname, '..', cleanPath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

module.exports = { deleteFile };
