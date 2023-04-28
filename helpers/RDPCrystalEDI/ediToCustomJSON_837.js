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
    result.claimTypeCode = "Dental???";

    if (transactionImplLastNumber == 1) {
        result.claimTypeCode = "Profesional";
    } else if (transactionImplLastNumber == 2) {
        result.claimTypeCode = "Institucional???";
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
        // //Get the claim
        // let claimLoop = billingProviderLoops.getItem(i).getLoop("2000B/2300");
        // if (claimLoop == null) {
        //     claimLoop = billingProviderLoops
        //         .getItem(i)
        //         .getLoop("2000B/2000C/2300");
        // }

        // let claimSegment = claimLoop.getSegment("CLM");

        // ediData +=
        //     "Claim ID = " + claimSegment.Elements.getItem(0).DataValue + "\n";
        // ediData +=
        //     "Claim Price = " +
        //     claimSegment.Elements.getItem(1).DataValue +
        //     "\n";

        // // let serviceLoops = claimLoop.getLoops("2400");

        // // for (let j = 0; j < serviceLoops.Count; j++) {
        // //     let serviceSegment = serviceLoops.getItem(j).getSegment("NM1");

        // //     ediData +=
        // //         "nm1 del claim= " +
        // //         serviceSegment.Elements.getItem(1).DataValue +
        // //         "\n";
        // // }

        // ediData += "\n\n";
    }

    return result;
    ////////////////////segunda forma
    // let fileLoader = new edi.EDIFileLoader();
    // //Load EDI data
    // fileLoader.EDIDataString = dataToLoad;
    // let flatDoc = fileLoader.load();
    // claimHeader = {
    //     Member_Id: "",
    //     Member_Last_Name: "",
    //     Plan_Id: "",
    //     Billing_Provider_NPI: "",
    //     Rejected: "N",
    //     Rejected_Reason: "",
    //     Client_Claim_No: "CLM-01",
    // };
    // const handleNM1 = (NM1Elements) => {
    //     if (NM1Elements[1] == "IL" && NM1Elements[8] == "MI") {
    //         claimHeader.Member_Id = NM1Elements[9];
    //     }
    //     if (NM1Elements[1] == "IL") {
    //         claimHeader.Member_First_Name = NM1Elements[4];
    //         claimHeader.Member_Last_Name = NM1Elements[3];
    //         return;
    //     }
    //     if (NM1Elements[1] == "PR") {
    //         claimHeader.Plan_Id = NM1Elements[3];
    //         return;
    //     }
    //     if (NM1Elements[1] == "85") {
    //         claimHeader.Billing_Provider_NPI = NM1Elements[9];
    //         return;
    //     }
    // };
    //Build a visual representation of the EDI document
    //writeSegment(flatDoc.Loops.getItem(0).segments);
    ////////////////////segunda forma fin
    // function writeDocumentTree(loop, indent) {
    //     if (loop != null) {
    //         for (let i = 0; i < indent; i++) {
    //             process.stdout.write("   ");
    //         }
    //         console.log(loop.Name);
    //         indent++;
    //         writeSegment(loop.Segments, indent);
    //         if (loop.Loops != null) {
    //             for (let i = 0; i < loop.Loops.Count; i++) {
    //                 writeDocumentTree(loop.Loops.getItem(i), indent);
    //             }
    //             indent++;
    //         }
    //     }
    // }
    //////////segunda forma
    // function writeSegment(segments) {
    //     for (let i = 0; i < segments.Count; i++) {
    //         let seg = segments.getItem(i);
    //         switch (seg.Name) {
    //             case "NM1":
    //                 handleNM1(writeElement(seg.Elements));
    //                 break;
    //             case "CLM":
    //                 const a = writeElement(seg.Elements);
    //                 console.log(a[1]);
    //                 break;
    //             default:
    //                 continue;
    //         }
    //     }
    // }
    ///////////////segunda forma fin
    ///////////segunda forma
    // function writeElement(elements) {
    //     const elementList = [];
    //     for (let i = 0; i < elements.Count; i++) {
    //         elementList[i + 1] = elements.getItem(i).DataValue;
    //     }
    //     return elementList;
    // }
    // if (ediErrors.length) {
    //     (claimHeader.Rejected = "Y"),
    //         ediErrors.forEach(
    //             (error) => (claimHeader.Rejected_Reason += `, ${error}`)
    //         );
    // }
    // return claimHeader;
    //segunda forma fin
    // claimDetail = {
    //     Line_Seq: "lo que hay en LX01",
    //     DOS_From: "lo que hay en DTP03",
    //     DOS_To: "lo que hay en DTP03",
    //     CPT_Code: "si SV101-01 es HC aquí pongo lo que hay en SV101-02",
    //     Primary_Diag:
    //         "si HI101 es BK aquí pongo lo que hay en el segmento anterior??????",
    //     Diagnosis_1:
    //         "si HI102 es BF aquí pongo lo que hay en el segmento anterior??????",
    //     Charge: "SV102",
    //     Unit: "SV104",
    // };
    // return [claimHeader, claimDetail];
    //get 2010AA loop
    // const _2010AA = document.MainSection.getLoop(
    //     "INTERCHANGE HEADER/FUNCTIONAL GROUP/ST HEADER/2000A/2010AA"
    // );
    // //get 2010AA NM1 Segment
    // const _2010AA_NM1 = _2010AA.getSegment("NM1");
    // //get Items for 2010AA NM1 segment
    // const _2010AA_NM101 = _2010AA_NM1.getItem(0);
    // const _2010AA_NM102 = _2010AA_NM1.getItem(1);
    // const _2010AA_NM103 = _2010AA_NM1.getItem(2);
    // const _2010AA_NM104 = _2010AA_NM1.getItem(3);
    // const _2010AA_NM105 = _2010AA_NM1.getItem(4);
    // const _2010AA_NM106 = _2010AA_NM1.getItem(5);
    // const _2010AA_NM107 = _2010AA_NM1.getItem(6);
    // const _2010AA_NM108 = _2010AA_NM1.getItem(7);
    // const _2010AA_NM109 = _2010AA_NM1.getItem(8);
    // return claimHeader;
};

module.exports = {
    ediToCustomJSON_837,
};

// Claim Header

//    Member_Id     IF NM1='IL' AND NM108='MI' THEN NM109
//   Member_First_Name  IF NM1='IL' THEN NM104
//   Member_Last_Name  IF NM1='IL' THEN NM103
//   Plan_Id      IF NM1='PR' AND NM108='PI' THEN NM103
//   Billing_Provider_NPI    IF NM1='85' THEN NM109

// Claim Detail (LOOP 2300,2400 CLAIM INFORMATION)

//   Line_Seq     LX01
//   DOS_From  DTP03
//   DOS_To    DTP03
//   CPT_Code  IF SV101-01='HC' THEN SV101-02
//   Primary_Diag  HI101 = 'BK' THE HI01  get the value after :
//   Diagnosis_1  HI102 = 'BF' THE HI01  get the value after :
//   Charge     SV102
//   Unit    SV104
