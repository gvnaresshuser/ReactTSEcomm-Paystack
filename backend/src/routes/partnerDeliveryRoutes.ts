import { Router } from "express";

import {
  getMyDeliveries,startDelivery,
  completeDelivery,getTrackingPoints
} from "../controllers/partnerDeliveryController.js";

import {
  partnerAuthMiddleware,
} from "../middleware/partnerAuthMiddleware.js";

const router = Router();

router.use(
  partnerAuthMiddleware,
);

router.get(
  "/",
  getMyDeliveries,
);
router.put(
  "/:id/start",
  startDelivery,
);

router.put(
  "/:id/complete",
  completeDelivery,
);

router.get(
  "/:id/tracking",
  getTrackingPoints,
);

export default router;