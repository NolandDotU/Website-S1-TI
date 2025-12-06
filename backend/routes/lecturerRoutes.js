import express from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import serviceFactory from "../service/base/factoryService.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await serviceFactory.get("lecturer").getAll(req.query);
    console.log(result);
    res.json(result);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const result = await serviceFactory.get("lecturer").create(req.body);
    res.json(result);
  })
);
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await serviceFactory.get("lecturer").delete(req.params.id);
    res.json(result);
  })
);
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await serviceFactory
      .get("lecturer")
      .update(req.params.id, req.body);
    res.json(result);
  })
);

export default router;
