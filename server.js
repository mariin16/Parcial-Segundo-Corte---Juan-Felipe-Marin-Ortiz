const express = require("express");
const candidatosRoutes = require("./routes/candidatos.routes");
const postulacionesRoutes = require("./routes/postulaciones.routes");

const PORT = 5000;
const api = express();

api.use(express.json());
api.use(express.static("public"));

api.use("/candidatos", candidatosRoutes);
api.use("/postulaciones", postulacionesRoutes);

api.listen(PORT, () => {
    console.log("Server running in http://localhost:5000")
});