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
      SELECT
        c.id,
        c.name,
        c.location,
        CONCAT('Rs ', TO_CHAR(c.fees, 'FM9,99,99,999'), ' / year') AS "feesRange",
        c.rating,
        CASE c.rank_band
          WHEN 'elite' THEN 'Top Tier'
          WHEN 'strong' THEN 'High'
          WHEN 'moderate' THEN 'Moderate'
          ELSE 'Emerging'
        END AS ranking,
        CASE
          WHEN c.tags IS NULL THEN ARRAY[]::text[]
          ELSE c.tags
        END AS "examsAccepted",
        p.placement_percentage AS "placementPercentage"
      FROM colleges c
      LEFT JOIN placements p ON p.college_id = c.id
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
