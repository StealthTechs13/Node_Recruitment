const multer = require('multer');
const filepath=__dirname;
 
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,filepath)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
 
var upload = multer({storage: storage});
 
module.exports = upload;