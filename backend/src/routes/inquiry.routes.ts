import { Router } from "express";

import {
  createInquiryController,
  getAllInquiriesController,
  getInquiryByIdController,
  updateInquiryStatusController
} from "../controllers/inquiry.controller.js";

import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

// Protect all inquiry endpoints
router.use(requireAuth);

// Create a new inquiry
router.post("/", createInquiryController);

// Get all inquiries
router.get("/", getAllInquiriesController);

// Get one inquiry
router.get("/:id", getInquiryByIdController);

router.patch("/:id/status", updateInquiryStatusController);

export default router;