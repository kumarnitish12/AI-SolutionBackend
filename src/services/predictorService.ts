import { pool } from "../db/pool";

interface PredictInput {
  exam: "JEE" | "NEET";
  rank: number;
}

export async function predictColleges(input: PredictInput) {
  const rankBand = getRankBand(input.rank);
  const preferredTag = input.exam === "JEE" ? "engineering" : "medical";

  const result = await pool.query(
    `
      SELECT c.id, c.name, c.location, c.fees, c.rating
      FROM colleges c
      WHERE c.tags @> ARRAY[$1]::text[]
        AND c.rank_band = $2
      ORDER BY c.rating DESC
      LIMIT 5
    `,
    [preferredTag, rankBand]
  );

  return {
    exam: input.exam,
    rank: input.rank,
    rankBand,
    suggestions: result.rows
  };
}

function getRankBand(rank: number): string {
  if (rank <= 5000) return "elite";
  if (rank <= 25000) return "strong";
  if (rank <= 60000) return "moderate";
  return "developing";
}
