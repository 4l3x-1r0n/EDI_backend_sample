const edi =
    require("rdpcrystal-edi-library/lib/RDPCrystalEDILibrary").RDPCrystalEDILibrary;

const ediToCustomJSON_837 = (loadedEDIFile, ediErrors) => {
    const result = {};

    let stTransaction = loadedEDIFile.Loops.getItem(0).getLoop(
        "INTERCHANGE HEADER/FUNCTIONAL GROUP/ST HEADER"
    );
    let stSegment = stTransaction.getSegment("ST");

    //Esto nos Muestra todos lo loops principales del documento(1000A, 1000B, etc..)
    // for (let i = 0; i < stTransaction.Loops.Count; i++) {
    //     console.log(stTransaction.Loops.getItem(i).Name);
    // }

    let ediData = "";

    result.transactionName = stSegment.Name;
    result.transactionNumber = stSegment.Elements.getItem(1).DataValue;
    result.transactionImpl = stSegment.Elements.getItem(2).DataValue;
    const transactionImplLastNumber =
        result.transactionImpl[result.transactionImpl.length - 1];
    result.claimTypeCode = "Dental";

    if (transactionImplLastNumber == 1) {
        result.claimTypeCode = "Profesional";
    } else if (transactionImplLastNumber == 2) {
        result.claimTypeCode = "Institucional";
    }

    result.rejected = ediErrors.length ? "Y" : "N";
    result.rejectedReason = ediErrors.length ? ediErrors : "";

    //
    //
    //
    //Get all billing providers
    let billingProviderLoops = stTransaction.getLoops("2000A");

    for (let i = 0; i < billingProviderLoops.Count; i++) {
        const claim = {
            billingProvider: "",
            billingProviderNPI: "",
            memberFirstName: "",
            memberLastName: "",
            memberAccountNumber: "",
        };

        //
        //
        //
        //Get billing provider 2000A/2010AA Loop
        const billingProviderLoop = billingProviderLoops
            .getItem(i)
            .getLoop("2010AA");

        // NM1
        const billingProviderNameSegment =
            billingProviderLoop.getSegment("NM1");

        claim.billingProvider =
            billingProviderNameSegment.Elements.getItem(2).DataValue;
        claim.billingProviderNPI =
            billingProviderNameSegment.Elements.getItem(8).DataValue;

        // REF
        const billingProviderRefSegment = billingProviderLoop.getSegment("REF");
        claim.billingProviderTaxId =
            billingProviderRefSegment.Elements.getItem(1).DataValue;

        //
        //
        //
        //Get subscriber name
        const subscriberLoop = billingProviderLoops
            .getItem(i)
            .getLoop("2000B/2010BA");
        const subscriberNameSegment = subscriberLoop.getSegment("NM1");

        claim.memberFirstName =
            subscriberNameSegment.Elements.getItem(3).DataValue;
        claim.memberLastName =
            subscriberNameSegment.Elements.getItem(2).DataValue;
        claim.memberAccountNumber =
            subscriberNameSegment.Elements.getItem(8).DataValue;

        const subscriberDMGSegment = subscriberLoop.getSegment("DMG");
        claim.memberDOB = subscriberDMGSegment.Elements.getItem(1).DataValue;

        //Get payer
        const payerLoop = billingProviderLoops
            .getItem(i)
            .getLoop("2000B/2010BB");
        const subscriberPayerSegment = payerLoop.getSegment("NM1");
        claim.planID = subscriberPayerSegment.Elements.getItem(8).DataValue;

        result.claims = result.claims ? [...result.claims, claim] : [claim];
    }

    return result;
};

module.exports = {
    ediToCustomJSON_837,
};
