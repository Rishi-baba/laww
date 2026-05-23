import mongoose from 'mongoose';

const dossierSchema = new mongoose.Schema({
  case_title: {
    type: String,
    required: [true, 'Case Title is required'],
    trim: true,
  },
  litigation_parties: {
    type: String,
    trim: true,
  },
  court_jurisdiction: {
    type: String,
    trim: true,
  },
  case_classification: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  strategic_counselor_notes: {
    type: String,
    trim: true,
  },
  uploaded_pdfs: [
    {
      fileName: { type: String, required: true },
      originalName: { type: String, required: true },
      filePath: { type: String, required: true },
      fileSize: { type: Number, required: true },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  extracted_text: {
    type: String,
    required: true,
  },
  predicted_sections: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  legal_sections: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  similar_cases: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  evidence_mapping: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  missing_evidence: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  analytics: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const Dossier = mongoose.model('Dossier', dossierSchema);

export default Dossier;
