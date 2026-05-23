export const mockCases = [
  {
    id: "case-singhania",
    case_title: "State of Maharashtra v. Vikram R. Singhania",
    filing_index: "CRA/2026/8841-B",
    jurisdiction: "Supreme Court of India (Appellate Jurisdiction)",
    date_logged: "May 12, 2026",
    type: "Criminal Appeal",
    brief_summary: "High-profile appeal challenging the circumstantial evidence conviction. Key focus is on contradiction between primary witness testimony and geofenced cellular towers.",
    predicted_sections: [
      "IPC Section 307 - Attempt to Murder",
      "IPC Section 506 - Criminal Intimidation"
    ],
    similar_cases: [
      {
        case_title: "State vs Arjun Sharma",
        similarity_score: 0.91,
        summary: "Property dispute leading to stabbing incident where geofencing contradicted the alibi."
      },
      {
        case_title: "Ramesh vs State of UP",
        similarity_score: 0.87,
        summary: "Eyewitness-supported violent assault case where delayed FIR was contested successfully."
      }
    ],
    missing_evidence: [
      "Weapon recovery report not found",
      "Forensic fingerprint analysis missing"
    ],
    risk_flags: [
      "Partial CCTV visibility",
      "No independent witnesses"
    ],
    recommended_actions: [
      "Collect forensic analysis report",
      "Verify timestamp consistency in CCTV footage"
    ],
    indexed_files: [
      {
        name: "First Information Report_FIR_102_2024.pdf",
        status: "SECURE INDEX"
      },
      {
        name: "Statement_Key_Witness_Dev_Sharma.txt",
        status: "SECURE INDEX"
      },
      {
        name: "BNS_Cellular_Triangulation_Report_VODAFONE.pdf",
        status: "SECURE INDEX"
      },
      {
        name: "Trial_Court_Judgment_Sessions_Mumbai.pdf",
        status: "SECURE INDEX"
      },
      {
        name: "Defense_Alibi_Affidavit_Dr_Mehta.pdf",
        status: "SECURE INDEX"
      }
    ]
  },
  {
    id: "case-mehta",
    case_title: "Arjun Mehta v. Corporation of Greater Mumbai",
    filing_index: "CRA/2026/7412-A",
    jurisdiction: "Bombay High Court (Original Jurisdiction)",
    date_logged: "April 18, 2026",
    type: "Civil Writ/Property",
    brief_summary: "Challenging municipal demolition notifications based on historic land deeds and contradictory municipal zoning boundaries.",
    predicted_sections: [
      "BNS Section 326 - Criminal Trespass",
      "IPC Section 427 - Mischief causing damage"
    ],
    similar_cases: [
      {
        case_title: "Mehta Projects vs BMC",
        similarity_score: 0.95,
        summary: "Stay order granted on identical zoning boundary disputes where surveyor logs were contested."
      },
      {
        case_title: "Karan Landholdings vs State",
        similarity_score: 0.82,
        summary: "Historic land grant preservation under civil code preventing municipal trespass."
      }
    ],
    missing_evidence: [
      "Original registered deed of 1968 missing",
      "Surveyor georeferencing coordinates unverified"
    ],
    risk_flags: [
      "Survey done without notice to occupant",
      "Expired construction permits"
    ],
    recommended_actions: [
      "Acquire certified copy of 1968 land registry",
      "Request court-appointed surveyor audit"
    ],
    indexed_files: [
      {
        name: "Demolition_Notice_BMC_Zoning_No_9.pdf",
        status: "SECURE INDEX"
      },
      {
        name: "Survey_Report_Georeferenced_Plot_14.csv",
        status: "SECURE INDEX"
      },
      {
        name: "Title_Deed_Historic_Registry_Book_12.pdf",
        status: "SECURE INDEX"
      },
      {
        name: "Affidavit_Of_Adjoining_Owner_Verma.pdf",
        status: "SECURE INDEX"
      }
    ]
  },
  {
    id: "case-kumar",
    case_title: "State of Delhi v. Ramesh Kumar",
    filing_index: "CRA/2026/9110-D",
    jurisdiction: "Delhi High Court (Appellate Jurisdiction)",
    date_logged: "June 02, 2026",
    type: "Criminal Appeal",
    brief_summary: "State appeal contesting trial court acquittal order in a geolocated armed robbery scenario based on post-facto witness hostility.",
    predicted_sections: [
      "IPC Section 392 - Armed Robbery",
      "IPC Section 397 - Dacoity with Attempt to Cause Death"
    ],
    similar_cases: [
      {
        case_title: "State of NCR vs S. Lal",
        similarity_score: 0.89,
        summary: "Circumstantial geofencing evidence overridden due to eyewitness turncoat in trial court."
      },
      {
        case_title: "R. Singh vs Delhi Administration",
        similarity_score: 0.84,
        summary: "Recovery of stolen inventory from unlisted locker room upheld as admissible evidence."
      }
    ],
    missing_evidence: [
      "Robbed inventory forensic trace report not found",
      "Hostile witness cross-examination transcripts missing"
    ],
    risk_flags: [
      "Eye-witnesses turned completely hostile during trial",
      "Delay of 14 hours in filing initial FIR"
    ],
    recommended_actions: [
      "Re-examine investigating officer on inventory logs",
      "Subpoena call-detail-records of hostile witness"
    ],
    indexed_files: [
      {
        name: "FIR_Armed_Robbery_No_14_Safdarjung.pdf",
        status: "SECURE INDEX"
      },
      {
        name: "Seizure_Memo_Gold_Ornaments_Recovered.txt",
        status: "SECURE INDEX"
      },
      {
        name: "Hostile_Witness_1_Trial_Statements.pdf",
        status: "SECURE INDEX"
      }
    ]
  }
];
