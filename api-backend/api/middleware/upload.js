import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imageDir = path.join(__dirname, "..", "images");
fs.mkdirSync(imageDir, { recursive: true });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir); // Folder tujuan
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
      },
});

export default multer({storage});