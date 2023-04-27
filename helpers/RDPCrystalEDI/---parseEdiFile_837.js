const { json } = require("express");

const edi =
    require("../../node_modules/rdpcrystal-edi-library/lib/RDPCrystalEDILibrary").RDPCrystalEDILibrary;

const parseEDI = (validator) => {
    // let validator = new edi.EDIValidator();
    // validator.EDIDataString = fileToParse;

    //Get the EDI document loaded into memory
    let loadedEDIFile = validator.EDILightWeightDocument;
    // let loadedEDIFile = validator.EDIDataString;

    //Get EDI Data
    let stTransaction = loadedEDIFile.Loops.getItem(0).getLoop(
        "INTERCHANGE HEADER/FUNCTIONAL GROUP/ST HEADER"
    );
    let stSegment = stTransaction.getSegment("ST");

    let ediData = {};

    ediData.transactionName = stSegment.Name;
    ediData.transactionNumber = stSegment.Elements.getItem(1).DataValue;
    ediData.transactionImpl = stSegment.Elements.getItem(2).DataValue;

    //Get all billing providers
    let billingProviderLoops = stTransaction.getLoops("2000A");

    return ediData;

    for (let i = 0; i < billingProviderLoops.Count; i++) {
        //Get billing provider name
        let billingProviderLoop = billingProviderLoops
            .getItem(i)
            .getLoop("2010AA");
        let billingProviderNameSegment = billingProviderLoop.getSegment("NM1");

        ediData +=
            "Billing Provider = " +
            billingProviderNameSegment.Elements.getItem(2).DataValue +
            "\n";

        //Get subscriber name
        let subscriberLoop = billingProviderLoops
            .getItem(i)
            .getLoop("2000B/2010BA");
        let subscriberNameSegment = subscriberLoop.getSegment("NM1");

        ediData +=
            "Subscriber Name = " +
            subscriberNameSegment.Elements.getItem(2).DataValue +
            "\n";

        //Get the claim
        let claimLoop = billingProviderLoops.getItem(i).getLoop("2000B/2300");
        if (claimLoop == null) {
            claimLoop = billingProviderLoops
                .getItem(i)
                .getLoop("2000B/2000C/2300");
        }

        let claimSegment = claimLoop.getSegment("CLM");

        ediData +=
            "Claim ID = " + claimSegment.Elements.getItem(0).DataValue + "\n";
        ediData +=
            "Claim Price = " +
            claimSegment.Elements.getItem(1).DataValue +
            "\n";

        let serviceLoops = claimLoop.getLoops("2400");

        // for (let j = 0; j < serviceLoops.Count; j++) {
        //     let serviceSegment = serviceLoops.getItem(j).getSegment("SV2");

        //     ediData +=
        //         "Service Price= " +
        //         serviceSegment.Elements.getItem(2).DataValue +
        //         "\n";
        // }

        ediData += "\n\n";
    }

    return ediData;
};

module.exports = {
    parseEDI,
};
