import { Router } from "express";

import {
  addPartnerTrackingPoint,
} from "../controllers/partnerTrackingController.js";

import {
  getPartnerTrackingPoints,
} from "../controllers/partnerTrackingController.js";

import {
  partnerAuthMiddleware,
} from "../middleware/partnerAuthMiddleware.js";

const router = Router();

router.use(
  partnerAuthMiddleware,
);

router.post(
  "/",
  addPartnerTrackingPoint,
);

router.get(
  "/:orderId",
  getPartnerTrackingPoints,
);

export default router;