import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
  return (
    res.json({
      success: true,
      message: "Lecturers",
    }),
    200
  );
});

export default router;
