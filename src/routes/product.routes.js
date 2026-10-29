const { Router } = require("express");
const validate = require("../middleware/validate.middleware");
const controller = require("../controller/product.controller");
const {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
  listQuerySchema,
} = require("../validators/product.validator");

const router = Router();

router.post("/", validate(createProductSchema), controller.createProduct);
router.get("/", validate(listQuerySchema, "query"), controller.listProducts);
router.get("/:id", validate(idParamSchema, "params"), controller.getProduct);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateProductSchema),
  controller.updateProduct
);
router.delete("/:id", validate(idParamSchema, "params"), controller.deleteProduct);

module.exports = router;
