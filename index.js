require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Creamos el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y Parseo del Body
app.use(express.json());

app.use("/testedi", require("./routes/edi.routes"));

app.listen(process.env.PORT || 3000, () =>
    console.log("Servidor corriendo en el puerto " + process.env.PORT || "3000")
);
