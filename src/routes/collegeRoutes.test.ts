import test from "node:test";
import assert from "node:assert/strict";
import { compareSchema, querySchema } from "./collegeRoutes";

test("query schema parses new filters", () => {
  const parsed = querySchema.parse({
    page: "2",
    limit: "20",
    location: "New Delhi",
    maxFees: "250000",
    minRating: "4.2",
    interest: "engineering"
  });

  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 20);
  assert.equal(parsed.maxFees, 250000);
  assert.equal(parsed.minRating, 4.2);
  assert.equal(parsed.interest, "engineering");
});

test("compare schema rejects less than two colleges", () => {
  assert.throws(() => compareSchema.parse({ collegeIds: [1] }));
});
