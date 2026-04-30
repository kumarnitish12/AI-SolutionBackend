import { Router } from "express";
import { z } from "zod";
import { predictColleges } from "../services/predictorService";

const predictSchema = z.object({
  exam: z.enum(["JEE", "NEET"]),
  rank: z.number().int().positive()
});

export const predictRouter = Router();

predictRouter.post("/", async (req, res, next) => {
  try {
    const payload = predictSchema.parse(req.body);
    const result = await predictColleges(payload);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
