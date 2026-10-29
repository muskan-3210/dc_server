const { Router } = require("express");
const validate = require("../middleware/validate.middleware");
const controller = require("../controller/category.controller");
const {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
  listQuerySchema,
} = require("../validators/category.validator");

const router = Router();

router.post("/", validate(createCategorySchema), controller.createCategory);
router.get("/", validate(listQuerySchema, "query"), controller.listCategories);
router.get("/:id", validate(idParamSchema, "params"), controller.getCategory);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateCategorySchema),
  controller.updateCategory
);
router.delete("/:id", validate(idParamSchema, "params"), controller.deleteCategory);

module.exports = router;