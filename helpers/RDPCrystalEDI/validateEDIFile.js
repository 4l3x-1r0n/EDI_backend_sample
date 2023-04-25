// <reference path="../../lib/RDPCrystalEDILibrary.d.ts" />
const edi =
    require("../../node_modules/rdpcrystal-edi-library/lib/RDPCrystalEDILibrary").RDPCrystalEDILibrary;
const fs = require("fs");
const enumMap = require("./enummap");
const { parseEDI } = require("./parseEdiFile_837");

function validateEdiFile(fileToTest, ruleFile) {
    let map = new enumMap();

    //Create a new validator
    let validator = new edi.EDIValidator();

    validator.EDIRulesFileData = ruleFile;
    validator.EDIDataString = fileToTest;

    // console.log("Validating EDI File");
    validator.validate();

    const result = [];
    for (let i = 0; i < validator.Errors.Count; i++) {
        let error = validator.Errors.getItem(i);

        result.push({
            Type: "Error",
            Line: error.LineNumber,
            Transaction: "",
            SnipLevel: map.SnipLevelTypes[error.SnipLevel], //SnipTestLevel Enum
            Message: map.MessageTypes[error.Message], //EDIValidationMessage Enum
            Loop: error.Loop,
            Segment: error.Segment,
            Element: error.ElementOrdinal,
            Composite: error.CompositeElementOrdinal,
            Description:
                error.Description === "Element 3 of SBR Required"
                    ? "Missign Group Number"
                    : error.Description,
            Ordinal: error.SegmentOrdinal,
        });
    }

    return result.length > 0 ? result : parseEDI(validator);
}

module.exports = {
    validateEdiFile,
};

//TODO:  validation.passed
//TODO:  raw data let lines = ediValidator.EDIFileLines;
