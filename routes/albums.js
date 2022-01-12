const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Album = require("../models/Albums");
const multer = require("multer");
const { isAuthenticated } = require("../helpers/auth");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

//Storage Multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

var upload = multer({ storage: storage });

//Routes

router.get("/albums/add", isAuthenticated, (req, res) => {
  res.render("albums/new-album");
});

router.get("/albums", isAuthenticated, async (req, res) => {
  const pic = await Album.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();

  res.render("albums/all-album", { pic });
});
router.get("/uploads/:path", (req, res) => {
  res.sendFile(path.join(__dirname, "../uploads/" + req.params.path));
});
router.post(
  "/uploadmultiple",
  upload.array("myFiles", 12),
  (req, res, next) => {
    if (req.files.length <= 0) {
      req.flash("error_msg", "Select almost one image");
      res.redirect("/albums/add");
    }
    req.files.map(async (file) => {
      const newAlbum = new Album({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        user: req.user.id,
      });
      return await newAlbum.save();
    });
    req.flash("success_msg", "Images Uploaded Successfully");
    res.redirect("/albums");

    //next()
  }
);

router.delete("/albums/delete/:id", isAuthenticated, async (req, res) => {


 
  await Album.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Foto Deleted Successfully");
  res.redirect("/albums");
});

module.exports = router;
