import { Router } from "express";
import {
  partnerLogin,
} from "../controllers/partnerAuthController.js";

const router = Router();

router.post(
  "/login",
  partnerLogin,
);

export default router;