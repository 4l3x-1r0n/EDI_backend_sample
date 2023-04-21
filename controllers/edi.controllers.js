const fs = require("fs");
const { validateEdiFile } = require("../helpers/RDPCrystalEDI/validateEDIFile");

const ediTest = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay ningún archivo",
        });
    }

    //procesar el archivo...
    const file = req.files.ediFile;

    // Path para guardar el archivo
    const path = process.cwd() + "/test.txt";

    // Mover el archivo
    file.mv(path, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: "Error al mover el archivo",
            });
        }

        //leemos el archivo con las validaciones
        const ruleFile = fs
            .readFileSync(process.cwd() + "/ruleFile.rules")
            .toString();

        //leemos el archivo a validar
        const fileToTest = fs
            .readFileSync(process.cwd() + "/test.txt")
            .toString();

        const validationResult = validateEdiFile(fileToTest, ruleFile);

        res.json({
            ok: true,
            validationResult,
        });
    });
};

module.exports = { ediTest };
