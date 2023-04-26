const ediToJSON_837 = (edifile) => {
    // claimHeader = {
    //     Member_Id: "si NM1 es IL y NM108 es MI aquí pongo lo que hay en NM109",
    //     Member_First_Name: "si NM1 es IL aquí pongo lo que hay en NM104",
    //     Member_Last_Name: "si NM1 es IL aquí pongo lo que hay en NM103",
    //     Plan_Id:
    //         "si NM1 es PR y NM108 es PI aquí pongo lo que hay en NM103 ???????? hay que validar mas cosas",
    //     Billing_Provider_NPI:
    //         "si NM1 es 85 aquí pongo lo que hay en NM109???? que pasa con Member_Id??? y los otros?",
    // };

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
    return "paso la validación";
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
