const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");
const Enlace = require("../models/Enlace");

exports.subirArchivo = async (req, res, next) => {
  const multerConfig = {
    limits: { fileSize: req.usuario ? 1000000 * 10 : 1000000 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, (__dirname = "./uploads"));
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    })),
  };
  const upload = multer(multerConfig).single("archivo");

  upload(req, res, async (error) => {
    console.log(req.file);

    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
  });
};
exports.eliminarArchivo = async (req, res) => {
  console.log(req.archivo);

  try {
    fs.unlinkSync((__dirname = `./uploads/${req.archivo}`));
    console.log("eliminado");
  } catch (error) {
    console.log(error);
  }
};

exports.descargar = async (req, res, next) => {
  const enlace = await Enlace.findOne({ nombre: req.params.archivo });

  const archivo = __dirname + "/../uploads/" + req.params.archivo;
  res.download(archivo);

  //si las descargas son iguales a 1 borrar entrada y archivo
  const { descargas, nombre } = enlace;
  if (descargas === 1) {
    //eliminar el archivo se pasa el nombre por request a eliminar archivo

    req.archivo = nombre;

    //eliminar entrada
    await Enlace.findOneAndRemove(enlace.id);
    next();
  } else {
    // si la descarga es > a 1 restarle 1
    enlace.descargas--;
    await enlace.save();
    console.log("quedan mas descargas");
  }
};
