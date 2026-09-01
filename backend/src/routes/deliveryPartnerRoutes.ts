import { Router } from "express";

import {
  getAdminDeliveryPartners,
  getAdminDeliveryPartner,
  createAdminDeliveryPartner,
  updateAdminDeliveryPartner,
  deleteAdminDeliveryPartner,
} from "../controllers/deliveryPartnerController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getAdminDeliveryPartners,
);

router.get(
  "/:id",
  authMiddleware,
  getAdminDeliveryPartner,
);

router.post(
  "/",
  authMiddleware,
  createAdminDeliveryPartner,
);

router.put(
  "/:id",
  authMiddleware,
  updateAdminDeliveryPartner,
);

router.delete(
  "/:id",
  authMiddleware,
  deleteAdminDeliveryPartner,
);

export default router;