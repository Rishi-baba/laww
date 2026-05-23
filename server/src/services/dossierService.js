import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import Dossier from '../models/Dossier_Model.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Service to orchestrate the Case Dossier Compilation Pipeline.
 */
class DossierService {
  /**
   * PDF Ingestion & Text Extraction Service.
   * Streams PDF briefs directly from local disk into the FastAPI multipart upload request.
   * @param {Array} files - Multer files array carrying local filesystem details.
   */
  async extractText(files) {
    if (!files || files.length === 0) {
      throw new Error('No PDF documents staged for extraction.');
    }

    const form = new FormData();
    for (const file of files) {
      // Open stream directly from local filesystem to prevent overloading node memory buffers
      form.append('files', fs.createReadStream(file.path), {
        filename: file.filename,
        contentType: file.mimetype
      });
    }

    try {
      const response = await axios.post(`${ML_SERVICE_URL}/extract_text`, form, {
        headers: {
          ...form.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      return response.data; // returns { merged_text, file_names }
    } catch (error) {
      console.error('FastAPI PDF text extraction failure:', error.response?.data || error.message);
      throw new Error(`Failed to extract text from PDF briefs: ${error.response?.data?.detail || error.message}`);
    }
  }

  /**
   * FastAPI Case Query Analysis Service.
   * Forwards extracted merged text streams to the FAISS + sentence transformers inference engine.
   * @param {string} extractedText - Merged case files plain text.
   * @returns {Promise<object>} Legal predicted sections, similar cases, missing evidence, timeline maps, and outcomes.
   */
  async analyzeCaseText(extractedText) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/analyze_case`, {
        query: extractedText
      });
      return response.data;
    } catch (error) {
      console.error('FastAPI case query analysis failure:', error.response?.data || error.message);
      throw new Error(`Inference engine failed to analyze case briefs: ${error.response?.data?.detail || error.message}`);
    }
  }

  /**
   * Orchestrates the Complete Compile Pipeline, moves files from temp to permanent local storage, and saves in MongoDB.
   * @param {object} caseMetadata - Case title, parties, jurisdiction, category notes.
   * @param {Array} files - Uploaded pdf files.
   * @param {string} userId - ID of the creating user.
   * @returns {Promise<object>} Compiled and saved dossier object.
   */
  async compileDossier(caseMetadata, files, userId) {
    // 1. PDF Ingestion & Extraction (FastAPI PyMuPDF / OCR Fallback)
    const { merged_text } = await this.extractText(files);

    // 2. ML Inference (FastAPI FAISS + sentence transformers)
    const mlAnalysis = await this.analyzeCaseText(merged_text);

    // 3. Save initial structured dossier in MongoDB to obtain a valid ObjectID
    const dossier = new Dossier({
      case_title: caseMetadata.case_title,
      litigation_parties: caseMetadata.litigation_parties,
      court_jurisdiction: caseMetadata.court_jurisdiction,
      case_classification: caseMetadata.case_classification,
      category: caseMetadata.category,
      strategic_counselor_notes: caseMetadata.strategic_counselor_notes || '',
      uploaded_pdfs: [], // Will populate after moving files permanently
      extracted_text: merged_text,
      predicted_sections: mlAnalysis.predicted_sections,
      legal_sections: mlAnalysis.legal_sections,
      similar_cases: mlAnalysis.similar_cases,
      evidence_mapping: mlAnalysis.evidence_mapping,
      missing_evidence: mlAnalysis.missing_evidence,
      analytics: mlAnalysis.analytics,
      createdBy: userId
    });

    await dossier.save();

    // 4. Move PDF uploads from temporary user directory to permanent dossier-structured directory
    try {
      const userIdStr = userId.toString();
      const dossierIdStr = dossier._id.toString();
      
      const tempDir = path.dirname(files[0].path);
      const permDir = path.join('uploads', `user_${userIdStr}`, `dossier_${dossierIdStr}`);
      
      // Auto-create directory recursively
      fs.mkdirSync(permDir, { recursive: true });
      
      const permFilesMetadata = [];
      for (const file of files) {
        const permFilePath = path.join(permDir, file.filename);
        
        // Move file
        fs.renameSync(file.path, permFilePath);
        
        permFilesMetadata.push({
          fileName: file.filename,
          originalName: file.originalname,
          filePath: permFilePath,
          fileSize: file.size,
          uploadedAt: new Date()
        });
      }
      
      // Clean up the empty temporary directory
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmdirSync(tempDir);
        }
      } catch (rmErr) {
        console.error("Non-fatal: Failed to clear temporary empty directory:", rmErr);
      }
      
      // Save finalized filesystem data to MongoDB
      dossier.uploaded_pdfs = permFilesMetadata;
      await dossier.save();
      
    } catch (fsError) {
      console.error("FileSystem movements failure during compilation. Rolling back DB write.", fsError);
      // Clean rollback
      await Dossier.findByIdAndDelete(dossier._id);
      throw new Error(`Failed to secure local filesystem folders for dossier portfolio: ${fsError.message}`);
    }

    return dossier;
  }

  /**
   * Fetches multiple dossiers for user with sorting, pagination, and newest-first ordering.
   * @param {string} userId - Authorized creator user ID.
   * @param {object} params - pagination, search, sorting.
   */
  async queryDossiers(userId, params = {}) {
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { createdBy: userId };
    
    // Optional basic case title search filter
    if (params.search) {
      query.case_title = { $regex: params.search, $options: 'i' };
    }

    const dossiers = await Dossier.find(query)
      .sort({ createdAt: -1 }) // Newest-first ordering
      .skip(skip)
      .limit(limit)
      .select('-extracted_text'); // Exclude large text from indexing lists for performance

    const total = await Dossier.countDocuments(query);

    return {
      dossiers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Fetches full single dossier details by ID.
   */
  async getDossierById(id, userId) {
    const dossier = await Dossier.findOne({ _id: id, createdBy: userId });
    if (!dossier) {
      throw new Error('Litigation dossier not found or unauthorized.');
    }
    return dossier;
  }

  /**
   * Deletes a case dossier from MongoDB and cleans up its corresponding local directory storage.
   */
  async removeDossier(id, userId) {
    const dossier = await Dossier.findOne({ _id: id, createdBy: userId });
    if (!dossier) {
      throw new Error('Litigation dossier not found or unauthorized.');
    }

    const userIdStr = userId.toString();
    const dossierIdStr = dossier._id.toString();
    const dossierDir = path.join('uploads', `user_${userIdStr}`, `dossier_${dossierIdStr}`);

    // Remove database document
    await Dossier.findByIdAndDelete(id);

    // Securely purge all associated filesystem brief copies recursively
    try {
      if (fs.existsSync(dossierDir)) {
        fs.rmSync(dossierDir, { recursive: true, force: true });
        console.log(`[DELETION] Purged case filesystem repository: ${dossierDir}`);
      }
    } catch (fsErr) {
      console.error(`Failed to clean dossier uploads directory on delete for ${id}:`, fsErr);
    }

    return { success: true };
  }
}

export default new DossierService();
