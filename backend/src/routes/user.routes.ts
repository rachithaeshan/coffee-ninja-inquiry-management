import { Router } from "express";

import {
  createUserController
} from "../controllers/user.controller.js";

const router = Router();

// Create a new employee
router.post("/", createUserController);

export default router;