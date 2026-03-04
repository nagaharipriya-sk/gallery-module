const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {getGallery,uploadImage,deleteImage} = require("../controllers/galleryController");

const storage = multer.diskStorage({
  destination:"uploads/",
  filename:(req,file,cb)=>{
    cb(null, Date.now()+path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits:{ fileSize:5000000 },
  fileFilter:(req,file,cb)=>{
    const allowed=/jpg|jpeg|png/;
    const ext=allowed.test(path.extname(file.originalname).toLowerCase());
    if(ext) cb(null,true);
    else cb("Images only!");
  }
});

router.get("/",getGallery);
router.post("/",upload.single("image"),uploadImage);
router.delete("/:id",deleteImage);

module.exports = router;
