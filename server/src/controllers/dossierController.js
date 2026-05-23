import fs from 'fs';
import path from 'path';
import dossierService from '../services/dossierService.js';

/**
 * Controller to handle Case Dossier HTTP requests.
 */
export const compileDossier = async (req, res) => {
  try {
    const { case_title, litigation_parties, court_jurisdiction, case_classification, category, strategic_counselor_notes } = req.body;
    const files = req.files; // Staged files parsed via multer diskStorage middleware

    // Request Validation
    if (!case_title || case_title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Case Title is required and cannot be empty.'
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please stage at least one PDF case brief for dossier compilation.'
      });
    }

    const metadata = {
      case_title,
      litigation_parties,
      court_jurisdiction,
      case_classification,
      category,
      strategic_counselor_notes
    };

    // Execute core Compile & Analyze Service Pipeline (Extract -> ML -> DB Save)
    const dossier = await dossierService.compileDossier(metadata, files, req.user._id);

    return res.status(201).json({
      success: true,
      message: 'Case dossier successfully ingested, analyzed, and indexed.',
      dossier
    });

  } catch (error) {
    console.error('Case dossier compilation endpoint error:', error);
    
    // Secure Cleanup: if compilation failed midway, purge any uploaded temp files immediately to save filesystem space
    if (req.files && req.files.length > 0) {
      try {
        const tempDir = path.dirname(req.files[0].path);
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
          console.log(`[CLEANUP] Purged temporary directory due to compilation crash: ${tempDir}`);
        }
      } catch (cleanErr) {
        console.error("Cleanup error after compilation crash:", cleanErr);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred during case dossier compilation.'
    });
  }
};

export const getDossiers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    
    const results = await dossierService.queryDossiers(req.user._id, {
      page,
      limit,
      search
    });

    return res.status(200).json({
      success: true,
      ...results
    });

  } catch (error) {
    console.error('Fetch dossiers list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve case dossiers index.'
    });
  }
};

export const getDossierById = async (req, res) => {
  try {
    const dossier = await dossierService.getDossierById(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      dossier
    });

  } catch (error) {
    console.error('Fetch single dossier details error:', error);
    return res.status(error.message.includes('unauthorized') ? 403 : 404).json({
      success: false,
      message: error.message || 'Failed to retrieve litigation dossier details.'
    });
  }
};

/**
 * SECURE FILE RETRIEVAL ROUTES (JWT protected, verification of ownership & path traversal safeguards)
 */
export const getDossierFilesList = async (req, res) => {
  try {
    const dossier = await dossierService.getDossierById(req.params.id, req.user._id);
    return res.status(200).json({
      success: true,
      files: dossier.uploaded_pdfs
    });
  } catch (error) {
    console.error('Fetch files list error:', error);
    return res.status(error.message.includes('unauthorized') ? 403 : 404).json({
      success: false,
      message: error.message || 'Failed to retrieve dossier files portfolio.'
    });
  }
};

export const serveDossierFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    
    // 1. Verifies ownership of the dossier by user ID (implicitly validated by getDossierById query logic)
    const dossier = await dossierService.getDossierById(id, req.user._id);
    
    // 2. Locate subdocument metadata record
    const fileMeta = dossier.uploaded_pdfs.id(fileId);
    if (!fileMeta) {
      return res.status(404).json({
        success: false,
        message: 'Evidentiary document not found in dossier portfolio.'
      });
    }

    // 3. Path Traversal validation to block directory injection attempts
    const resolvedPath = path.resolve(fileMeta.filePath);
    const uploadsRoot = path.resolve('uploads');
    if (!resolvedPath.startsWith(uploadsRoot)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Out-of-bounds filesystem pathway.'
      });
    }

    // 4. Validate file exists on disk
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({
        success: false,
        message: 'The requested brief is no longer active on the server filesystem.'
      });
    }

    // 5. Securely stream legal PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileMeta.originalName}"`);

    const stream = fs.createReadStream(resolvedPath);
    stream.pipe(res);

  } catch (error) {
    console.error('File download server failure:', error);
    return res.status(error.message.includes('unauthorized') ? 403 : 404).json({
      success: false,
      message: error.message || 'Failed to stream brief document.'
    });
  }
};

export const deleteDossier = async (req, res) => {
  try {
    const { id } = req.params;
    await dossierService.removeDossier(id, req.user._id);
    
    return res.status(200).json({
      success: true,
      message: 'Case dossier and associated physical document briefs successfully purged.'
    });
  } catch (error) {
    console.error('Case dossier deletion failure:', error);
    return res.status(error.message.includes('unauthorized') ? 403 : 404).json({
      success: false,
      message: error.message || 'Failed to delete case dossier.'
    });
  }
};
