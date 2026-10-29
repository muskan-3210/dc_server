const { Router } = require("express");
const { requireAuth, requireOnboarded } = require("../middleware/auth.middleware");

const router = Router();

// One place that mounts every route group under /api.
router.use("/auth", require("./auth.routes"));
router.use("/onboarding", require("./onboarding.routes")); // requires auth inside the router
router.use("/categories", requireAuth, requireOnboarded, require("./category.routes"));
router.use("/products", requireAuth, requireOnboarded, require("./product.routes"));
router.use("/uploads", requireAuth, requireOnboarded, require("./upload.routes"));
router.use("/movies", requireAuth, requireOnboarded, require("./movie.routes"));

module.exports = router;
