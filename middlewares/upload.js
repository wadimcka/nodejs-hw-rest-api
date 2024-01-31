const multer = require("multer");

const path = require("node:path");

const tempAvatarPath = path.join(__dirname, "..", "temp");
const multerConfig = multer.diskStorage({
  destination: tempAvatarPath,

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
