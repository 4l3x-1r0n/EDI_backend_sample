const ediToJSON_837 = (document) => {
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
    const _2010AA = document.MainSection.getLoop(
        "INTERCHANGE HEADER/FUNCTIONAL GROUP/ST HEADER/2000A/2010AA"
    );

    //get 2010AA NM1 Segment
    const _2010AA_NM1 = _2010AA.getSegment("NM1");

    //get Items for 2010AA NM1 segment
    const _2010AA_NM101 = _2010AA_NM1.getItem(0);
    const _2010AA_NM102 = _2010AA_NM1.getItem(1);
    const _2010AA_NM103 = _2010AA_NM1.getItem(2);
    const _2010AA_NM104 = _2010AA_NM1.getItem(3);
    const _2010AA_NM105 = _2010AA_NM1.getItem(4);
    const _2010AA_NM106 = _2010AA_NM1.getItem(5);
    const _2010AA_NM107 = _2010AA_NM1.getItem(6);
    const _2010AA_NM108 = _2010AA_NM1.getItem(7);
    const _2010AA_NM109 = _2010AA_NM1.getItem(8);

    claimHeader = {
        Member_Id:
            _2010AA_NM101 === "IL" && _2010AA_NM108 === MI ? _2010AA_NM109 : "",
        Member_First_Name: _2010AA_NM101 === "IL" ? _2010AA_NM104 : "",
        Member_Last_Name: _2010AA_NM101 === "IL" ? _2010AA_NM103 : "",
        Plan_Id: _2010AA_NM101 === "PR" ? _2010AA_NM103 : "",
        Billing_Provider_NPI: _2010AA_NM101 === "85" ? _2010AA_NM109 : "",
        Rejected: "N",
        Rejected_Reason: "",
    };

    return claimHeader;
};

module.exports = {
    ediToJSON_837,
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
