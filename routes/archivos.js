const express = require("express");
const router = express.Router();
const archivoController = require("../controllers/archivoController.js");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const multer = require("multer");

router.post("/", auth, archivoController.subirArchivo);
router.get(
  "/:archivo",
  archivoController.descargar,
  archivoController.eliminarArchivo
);

module.exports = router;
