import multer, { MulterError } from "multer";
import shortid from "shortid";
import { existsSync, mkdirSync, unlink } from "node:fs";
import __dirname from "../helpers/dirname.js";

//sube la imagen al servidor
export const uploadImage = (req, res, next) => {
  const uploadPath = __dirname + "/../public/uploads";

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}-${Date.now()}.${extension}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter(req, file, cb) {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        return cb(null, true);
      }

      const error = new MulterError("FORMAT_INVALID");
      error.field = "file";
      error.message = "Formato inválido, suba imágenes JPG/JPEG o PNG";

      cb(error, false);
    },
  }).single("imagen");

  upload(req, res, function (err) {
    if (err && err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        req.flash("error", "Imagen muy pesada Máx. 2MB");
      }
      if (err.code === "FORMAT_INVALID") {
        req.flash("error", err.message);
      }
      if (req.params.id) {
        return res.redirect(`/edit-group/${req.params.id}`);
      } else {
        return res.redirect("/new-group");
      }
    }

    return next();
  });
};

export const deleteImage = (imagen) => {
  if (!imagen) {
    return;
  }
  const path = __dirname + `/../public/uploads/${imagen}`;
  unlink(path, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Se elimino la imagen: ${imagen}`);
  });
};
