import { Router } from "express";
import { submitQuoteRequest,getQuoteRequests } from "../controllers/quoteRequestController.js";

const router = Router();

router.post("/", submitQuoteRequest);
router.get("/", getQuoteRequests);

export default router;