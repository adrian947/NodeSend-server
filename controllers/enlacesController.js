const Enlace = require("../models/Enlace");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res, next) => {
  //revisar si hay errores

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Crear un objeto de enlace
  const { nombre_original, password, nombre } = req.body;

  const enlace = new Enlace();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;
  enlace.password = password;

  if (req.usuario) {
    const { password, descargas } = req.body;

    //ASIGNAR A ENLACE EL NUMERO DE DESCARGAS

    if (descargas) {
      enlace.descargas = descargas;
    }

    //asignar un password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }
    //asignar el autor

    enlace.autor = req.usuario.id;
  }
  //almacenar en la DB
  try {
    await enlace.save();
    res.json(`${enlace.url}`);
    return next();
  } catch (error) {
    console.log(error);
  }
};

//obtiene un listado de todos los enlaces

exports.todosEnlaces = async (req, res) => {
  const enlaces = await Enlace.find({}).select("url -_id");
  res.json({ enlaces });
  try {
  } catch (error) {
    console.log(error);
  }
};

exports.obtenerEnlace = async (req, res, next) => {
  //verificar si el enlace existe

  const enlace = await Enlace.findOne({ url: req.params.url });

  if (!enlace) {
    res.status(404).json({ msg: "No se encontro enlace" });
    return next();
  }

  res.json({ archivo: enlace.nombre, password: false });

  next();
};
//retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {
  const enlace = await Enlace.findOne({ url: req.params.url });

  if (!enlace) {
    res.status(404).json({ msg: "No se encontro enlace" });
    return next();
  }

  if (enlace.password) {
    return res.json({ password: true, enlace: enlace.url, archivo: enlace.nombre });
  }
  next();
};

//verifica si el password es correcto
exports.verificarPassword = async (req, res, next) => {
  const pass = req.body.password;
  //consulta por enlace
  const enlace = await Enlace.findOne({ url: req.params.url });
  console.log(enlace);
  
  
  //verificar password
  
  if(bcrypt.compareSync(pass, enlace.password)){
     
     next();
    
    //permitir descarga

  }else{
    return res.status(401).json({msg: 'El password es incorrecto'})
  }
};
