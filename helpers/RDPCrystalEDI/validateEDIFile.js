// <reference path="../../lib/RDPCrystalEDILibrary.d.ts" />
const edi =
    require("../../node_modules/rdpcrystal-edi-library/lib/RDPCrystalEDILibrary").RDPCrystalEDILibrary;
const fs = require("fs");
const enumMap = require("./enummap");
const { ediToCustomJSON_837 } = require("./ediToCustomJSON_837");

function validateEdiFile(fileToTest, ruleFile) {
    let map = new enumMap();

    //Create a new validator
    let validator = new edi.EDIValidator();

    validator.EDIRulesFileData = ruleFile;
    validator.EDIDataString = fileToTest;

    // console.log("Validating EDI File");
    validator.validate();

    // if (!validator.passed) {
    //     console.log("?????");
    //     return ediToJSON_837();
    // }

    const result = [];
    for (let i = 0; i < validator.Errors.Count; i++) {
        let error = validator.Errors.getItem(i);
        
        let errorTratado = error.Description;


        if (errorTratado === "Element 3 of SBR Required") {
            errorTratado = "Missing Group Number";
        }
        // error.Description === "Element 3 of SBR Required"
        //         ? "Missing Group Number"
        //         : error.Description;
        if (errorTratado.indexOf("Loop: 2310C [SERVICE FACILITY LOCATION] Required but not found.") !== -1) {
            errorTratado = 'Facility Provider NPI Not Found';
        }   
    
        result.push(errorTratado
            // Type: "Error",
            // Line: error.LineNumber,
            // Transaction: "",
            // SnipLevel: map.SnipLevelTypes[error.SnipLevel], //SnipTestLevel Enum
            // Message: map.MessageTypes[error.Message], //EDIValidationMessage Enum
            // Loop: error.Loop,
            // Segment: error.Segment,
            // Element: error.ElementOrdinal,
            // Composite: error.CompositeElementOrdinal,
            // Description:
            
            
                
            // Ordinal: error.SegmentOrdinal,
        );
    }

    return ediToCustomJSON_837(validator.EDILightWeightDocument, result);
}

module.exports = {
    validateEdiFile,
};

//TODO:  raw data let lines = ediValidator.EDIFileLines;
