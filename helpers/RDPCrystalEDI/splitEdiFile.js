const edi =
    require("../../node_modules/rdpcrystal-edi-library/lib/RDPCrystalEDILibrary").RDPCrystalEDILibrary;

const splitEdiFile = (ediFile) => {
    let splitter = new edi.EDIFileSplitter();

    //Split the document at the ST header
    splitter.FileSplitLevel = edi.FileSplitLevel.HEADER;

    //Put 1 ST-SE loop in each file
    splitter.NumberOfItemsPerFile = 1;

    let splitDocs = splitter.split(ediFile);

    return splitDocs;
};

module.exports = {
    splitEdiFile,
};
