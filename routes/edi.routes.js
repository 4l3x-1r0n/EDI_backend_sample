/* 
    Ruta: /testedi
*/
const expressFileUpload = require("express-fileupload");
const { Router } = require("express");
const { ediTest } = require("../controllers/edi.controllers");

const router = Router();

router.use(expressFileUpload());
router.post("/", ediTest);

module.exports = router;
