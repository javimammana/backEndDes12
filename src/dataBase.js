import mongoose from "mongoose";

import configObject from "./config/configEnv.js";

mongoose.connect(configObject.mongo_url)
    .then(() => console.log ("Conexion exitosa"))
    .catch((error) => console.log("Error en la conexion", error))