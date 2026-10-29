const { Router } = require("express");
const validate = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const controller = require("../controller/onboarding.controller");
const {
  createOnboardingSchema,
  updateOnboardingSchema,
} = require("../validators/onboarding.validator");

const router = Router();

router.use(requireAuth);

router.post("/", validate(createOnboardingSchema), controller.createOnboarding);
router.get("/me", controller.getMyOnboarding);
router.patch("/me", validate(updateOnboardingSchema), controller.updateMyOnboarding);

module.exports = router;
