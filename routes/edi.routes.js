/* 
    Ruta: /testedi
*/
const expressFileUpload = require("express-fileupload");
const { Router } = require("express");
const { ediTest, setRulesFile } = require("../controllers/edi.controllers");
const { fileExist } = require("../middlewares/fileExist.middleware");

const router = Router();

router.use(expressFileUpload()); //TODO configurarlo para que use un archivo temporal, que admita extensiones especificas, y un tamaño maximo
router.post("/", fileExist, ediTest);

router.post("/setrulesfile", fileExist, setRulesFile);

module.exports = router;
