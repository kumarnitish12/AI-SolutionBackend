import { Router } from "express";
import { z } from "zod";
import { compareColleges, getCollegeById, getColleges } from "../services/collegeService";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  minFees: z.coerce.number().int().nonnegative().optional(),
  maxFees: z.coerce.number().int().nonnegative().optional()
});

const idSchema = z.object({
  id: z.coerce.number().int().min(1)
});

const compareSchema = z.object({
  collegeIds: z.array(z.number().int().min(1)).min(2).max(3)
});

export const collegeRouter = Router();

collegeRouter.get("/", async (req, res, next) => {
  try {
    const parsed = querySchema.parse(req.query);
    const result = await getColleges(parsed);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

collegeRouter.post("/compare", async (req, res, next) => {
  try {
    const { collegeIds } = compareSchema.parse(req.body);
    const data = await compareColleges(collegeIds);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

collegeRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = idSchema.parse(req.params);
    const data = await getCollegeById(id);
    if (!data) {
      res.status(404).json({ message: "College not found" });
      return;
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});
