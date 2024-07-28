const multer = require('multer');
const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        const originalName = file?.originalname;
        cb(null, `${Date.now()}${originalName.replace(/ /g, "")}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only image files are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = { upload };