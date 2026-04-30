import { pool } from "../db/pool";
import { CollegeDetails, CollegeListItem } from "../types";

interface CollegeQueryInput {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
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

  if (typeof input.minFees === "number") {
    values.push(input.minFees);
    whereClauses.push(`c.fees >= $${values.length}`);
  }

  if (typeof input.maxFees === "number") {
    values.push(input.maxFees);
    whereClauses.push(`c.fees <= $${values.length}`);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM colleges c
    ${whereSql}
  `;

  const listValues = [...values, input.limit, offset];
  const listQuery = `
    SELECT c.id, c.name, c.location, c.fees, c.rating
    FROM colleges c
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
      SELECT id, name, location, fees, rating, overview
      FROM colleges
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
    SELECT c.id, c.name, c.location, c.fees, c.rating, p.placement_percentage
    FROM colleges c
    LEFT JOIN placements p ON p.college_id = c.id
    WHERE c.id = ANY($1::int[])
    ORDER BY c.rating DESC
  `;

  const result = await pool.query(query, [collegeIds]);
  return result.rows;
}
