const Gallery = require("../models/Gallery");

exports.getGallery = async (req,res)=>{
  const images = await Gallery.find().sort({createdAt:-1});
  res.json(images);
};

exports.uploadImage = async (req,res)=>{
  if(!req.file) return res.status(400).json({message:"No file uploaded"});

  const newImage = await Gallery.create({
    imageUrl:`/uploads/${req.file.filename}`
  });

  res.status(201).json(newImage);
};

exports.deleteImage = async (req,res)=>{
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({message:"Deleted successfully"});
};
