const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ success: false, message: "No file uploaded" });
  }

  // Upload the file to Cloudinary
  cloudinary.uploader.upload(
    req.file.path,
    { folder: "product-uploads" },
    (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        return res
          .status(500)
          .send({ success: false, message: "File upload to Cloudinary failed" });
      }

      // Delete the temporary file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);

      // Return the uploaded file information (including URL)
      res.json({
        success: true,
        message: "File uploaded successfully!",
        file: result,
      });
    }
  );
};

module.exports = { uploadFile };
