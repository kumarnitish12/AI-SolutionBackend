import { pool } from "../db/pool";
import { CollegeDetails, CollegeListItem } from "../types";

interface CollegeQueryInput {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  maxFees?: number;
  minRating?: number;
  interest?: string;
}

export interface CollegeFacets {
  locations: string[];
  interests: string[];
}

export async function getColleges(input: CollegeQueryInput) {
  const offset = (input.page - 1) * input.limit;
  const values: Array<string | number> = [];
  const whereClauses: string[] = [];

  if (input.search) {
    values.push(`%${input.search}%`);
    whereClauses.push(`c.name ILIKE $${values.length}`);
  }

  if (input.location) {
    values.push(input.location);
    whereClauses.push(`c.location = $${values.length}`);
  }

  if (typeof input.maxFees === "number") {
    values.push(input.maxFees);
    whereClauses.push(`c.fees <= $${values.length}`);
  }

  if (typeof input.minRating === "number") {
    values.push(input.minRating);
    whereClauses.push(`c.rating >= $${values.length}`);
  }

  if (input.interest) {
    values.push(input.interest.toLowerCase());
    whereClauses.push(`c.tags @> ARRAY[$${values.length}]::text[]`);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM colleges c
    ${whereSql}
  `;

  const listValues = [...values, input.limit, offset];
  const listQuery = `
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
    ${whereSql}
    ORDER BY c.rating DESC, c.name ASC
    LIMIT $${listValues.length - 1}
    OFFSET $${listValues.length}
  `;

  const [countResult, listResult] = await Promise.all([
    pool.query<{ total: number }>(countQuery, values),
    pool.query<CollegeListItem>(listQuery, listValues)
  ]);

  return {
    data: listResult.rows,
    total: countResult.rows[0]?.total ?? 0,
    page: input.page,
    limit: input.limit
  };
}

export async function getCollegeById(id: number): Promise<CollegeDetails | null> {
  const collegeResult = await pool.query(
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
        p.placement_percentage AS "placementPercentage",
        c.overview
      FROM colleges c
      LEFT JOIN placements p ON p.college_id = c.id
      WHERE id = $1
    `,
    [id]
  );

  if (!collegeResult.rowCount) {
    return null;
  }

  const coursesPromise = pool.query(
    `
      SELECT id, course_name, duration_years, annual_fees
      FROM courses
      WHERE college_id = $1
      ORDER BY annual_fees ASC
    `,
    [id]
  );

  const placementPromise = pool.query(
    `
      SELECT avg_package_lpa, placement_percentage, top_recruiters
      FROM placements
      WHERE college_id = $1
    `,
    [id]
  );

  const [coursesResult, placementResult] = await Promise.all([coursesPromise, placementPromise]);

  return {
    ...collegeResult.rows[0],
    courses: coursesResult.rows,
    placement: placementResult.rows[0] ?? null
  };
}

export async function compareColleges(collegeIds: number[]) {
  const query = `
    SELECT
      c.id,
      c.name,
      c.location,
      CONCAT('Rs ', TO_CHAR(c.fees, 'FM9,99,99,999'), ' / year') AS "feesRange",
      c.rating,
      p.placement_percentage AS "placementPercentage"
    FROM colleges c
    LEFT JOIN placements p ON p.college_id = c.id
    WHERE c.id = ANY($1::int[])
    ORDER BY c.rating DESC
  `;

  const result = await pool.query(query, [collegeIds]);
  return result.rows;
}

export async function getCollegeFacets(): Promise<CollegeFacets> {
  const [locationsResult, interestsResult] = await Promise.all([
    pool.query<{ location: string }>(
      `
      SELECT DISTINCT location
      FROM colleges
      WHERE location IS NOT NULL AND location <> ''
      ORDER BY location ASC
      `
    ),
    pool.query<{ interest: string }>(
      `
      SELECT DISTINCT UNNEST(tags) AS interest
      FROM colleges
      WHERE tags IS NOT NULL
      ORDER BY interest ASC
      `
    )
  ]);

  return {
    locations: locationsResult.rows.map((row) => row.location),
    interests: interestsResult.rows.map((row) => row.interest)
  };
}
