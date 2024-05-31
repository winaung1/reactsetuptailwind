const FrontPage  = require('../Models/FrontPageModel')
const env = require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const fs = require("fs");

const getAllItems = async (req, res) => {
    const findAll = await FrontPage.find();
    res.json(findAll);
}

// Configure AWS SDK with your AWS credentials
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;

// Create an instance of the S3 service
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
};
// upload to s3
const upload = multer({ dest: "uploads/" });

const getUpload = (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
}

// Route for uploading image to S3 and saving data
const uploadPhotos = async (req, res) => {
  try {
    // Handle file upload using multer
    upload.single('image-upload')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(400).json({ error: 'File upload error' });
      }

      // Extract data from request body
      const {category, id, name, price, description } = req.body;

      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'Please upload an image' });
      }

      // Upload image to S3
      const imageUrl = req.file; // Assuming `req.file` contains the file data
      const result = await uploadFile(imageUrl); // Assuming `uploadFile` uploads to S3

      // Create a new item in the database
      const newItem = new FrontPage({
        id,
        name,
        price,
        description,
        category,
        imageUrl: result.Location, // Assuming `result.Location` is the S3 URL
      });

      // Save the new item to the database
      await newItem.save();

      // Respond with the uploaded image URL
      res.json({ message: 'Successfully added!' });
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteItem = async (req, res) => {
  const {item} = req.body
  try {
    
    const findItem = await FrontPage.findOneAndDelete({_id: item})

    if(!findItem){
      res.json({message: 'cannot find item by this', data: findItem})
    }


    res.json({message: 'Found item', data: findItem})
  } catch (error) {
    console.error('Cannot delet item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




module.exports = {getAllItems, getUpload, uploadPhotos, deleteItem}