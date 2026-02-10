import express from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// All routes require authentication with client role
router.use(authenticateToken);
router.use(requireRole('client'));

router.post(
  '/tax-years/:year/documents',
  upload.single('file'),
  DocumentController.uploadDocument
);

router.get(
  '/tax-years/:year/documents',
  DocumentController.listDocuments
);

router.delete(
  '/documents/:id',
  DocumentController.deleteDocument
);

router.get(
  '/documents/:id/download',
  DocumentController.downloadDocument
);

export default router;
