const express = require("express");
const router = express.Router();
const enlacesController = require("../controllers/enlacesController");
const archivosController = require("../controllers/archivoController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post(
  "/",

  [
    check("nombre", "Sube un Archivo").not().isEmpty(),
    check("nombre_original", "Sube un Archivo").not().isEmpty(),
  ],

  auth,
  enlacesController.nuevoEnlace
);

router.get(
  "/",

  enlacesController.todosEnlaces
);

router.get(
  "/:url",

  enlacesController.tienePassword,
  enlacesController.obtenerEnlace
);

router.post(
  "/:url",

  enlacesController.verificarPassword,
  enlacesController.obtenerEnlace
);

module.exports = router;
