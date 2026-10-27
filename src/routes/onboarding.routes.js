const { Router } = require("express");
const validate = require("../middleware/validate.middleware");
const controller = require("../controller/onboarding.controller");
const {
  createOnboardingSchema,
  updateOnboardingSchema,
  updateStatusSchema,
  idParamSchema,
  listQuerySchema,
} = require("../validators/onboarding.validator");

const router = Router();

router.post("/", validate(createOnboardingSchema), controller.createOnboarding);
router.get("/", validate(listQuerySchema, "query"), controller.listOnboarding);
router.get("/:id", validate(idParamSchema, "params"), controller.getOnboarding);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateOnboardingSchema),
  controller.updateOnboarding
);
router.patch(
  "/:id/status",
  validate(idParamSchema, "params"),
  validate(updateStatusSchema),
  controller.updateStatus
);

module.exports = router;