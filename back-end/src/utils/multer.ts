import multer from "multer";

const diskStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const name = crypto.randomUUID();
    const extension = file.mimetype.split("/")[1];
    cb(null, `${name}.${extension}`);
  },
  destination: (req, file, cb) => {
    cb(null, "./public/imgs");
  },
});

export const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 20 }, // 20MB
});
