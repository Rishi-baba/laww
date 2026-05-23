import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  compileDossier, 
  getDossiers, 
  getDossierById, 
  getDossierFilesList, 
  serveDossierFile,
  deleteDossier
} from '../controllers/dossierController.js';
import { protect } from '../middleware/protected.js';

// Configure Multer Disk Storage to organize files securely by User ID
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const userId = req.user._id.toString();
      // Generate a unique temp directory ID for this request session to prevent multi-file race conditions
      const tempDirId = req.tempDirId || (req.tempDirId = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`);
      const destPath = path.join('uploads', `user_${userId}`, `temp_${tempDirId}`);
      
      // Automatically construct directories recursively if not present
      fs.mkdirSync(destPath, { recursive: true });
      cb(null, destPath);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    // Sanitize the original file name and append unique time markers to prevent system naming collisions
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '') // Strips any potential path traversals, special chars, or command injections
      .substring(0, 100);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  }
});

// Configure Multer limits and PDF-only filters
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 45 * 1024 * 1024, // 45 MB max upload limits per file
  },
  fileFilter: (req, file, cb) => {
    // Restrict strictly to standard PDF mimetype structures
    if (file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only standard PDF briefs are authorized for pipeline ingestion.'), false);
    }
  }
});

const router = express.Router();

// Stage 4 MERN Ingestion routes
router.post('/compile', protect, upload.array('files', 10), compileDossier);

// Retrieves dynamic paginated list of dossiers
router.get('/', protect, getDossiers);

// Retrieves files metadata list for a specific dossier
router.get('/:id/files', protect, getDossierFilesList);

// Securely stream and download a specific PDF brief from the local directory
router.get('/:id/files/:fileId', protect, serveDossierFile);

// Retrieves full case profile by ID
router.get('/:id', protect, getDossierById);

// Deletes the whole case dossier and physical files permanently
router.delete('/:id', protect, deleteDossier);

export default router;
