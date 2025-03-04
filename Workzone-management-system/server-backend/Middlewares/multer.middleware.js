// 
const multer = require("multer");
const fs = require('fs');
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        const dir = "./public/temp";
        // Check if directory exists, if not, create it
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });
module.exports = {
    upload
};
