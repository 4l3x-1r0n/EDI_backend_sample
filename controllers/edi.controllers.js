const fs = require("fs");

const { splitEdiFile } = require("../helpers/RDPCrystalEDI/splitEdiFile");
const { validateEdiFile } = require("../helpers/RDPCrystalEDI/validateEDIFile");

const ediTest = (req, res) => {
    //procesar el archivo...,  ya evaluamos si viene el archivo con un middleware
    const file = req.files.ediFile;
    if (!file) {
        return res.status(400).json({
            ok: false,
            ms: "la parámetro key del archivo no es el requerido",
        });
    }

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

        const splitedEdiFiles = splitEdiFile(fileToTest);

        const result = splitedEdiFiles.map((edifile) =>
            validateEdiFile(edifile, ruleFile)
        );
        // const result = validateEdiFile(fileToTest, ruleFile);

        res.json({
            ok: true,
            documents: `----${splitedEdiFiles.length}----`,
            result,
        });
    });
};

const setRulesFile = (req, res) => {
    //procesar el archivo...,  ya evaluamos si viene el archivo con un middleware
    const file = req.files.rulesFile;

    if (!file) {
        return res.status(400).json({
            ok: false,
            ms: "la parámetro key del archivo no es el requerido",
        });
    }
    // Path para guardar el archivo
    const path = process.cwd() + "/ruleFile.rules";

    // Mover el archivo
    file.mv(path, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: "Error al mover el archivo",
            });
        }

        res.json({
            ok: true,
            msg: "Archivo Subido Correctamente",
        });
    });
};
module.exports = { ediTest, setRulesFile };
