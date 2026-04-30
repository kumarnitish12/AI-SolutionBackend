import express from "express";
import cors from "cors";
import { ZodError } from "zod";
import { z } from "zod";
import { collegeRouter } from "./routes/collegeRoutes";
import { predictRouter } from "./routes/predictRoutes";
import { compareColleges } from "./services/collegeService";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/colleges", collegeRouter);
app.use("/predict", predictRouter);
app.post("/compare", async (req, res, next) => {
  try {
    const schema = z.object({
      collegeIds: z.array(z.number().int().min(1)).min(2).max(3)
    });
    const { collegeIds } = schema.parse(req.body);
    const data = await compareColleges(collegeIds);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Invalid request",
      issues: err.issues
    });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});
