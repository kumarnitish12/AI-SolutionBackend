export interface CollegeListItem {
  id: number;
  name: string;
  location: string;
  feesRange: string;
  rating: number;
  ranking: string;
  examsAccepted: string[];
  placementPercentage: number | null;
}

export interface CollegeDetails extends CollegeListItem {
  overview: string;
  courses: Array<{
    id: number;
    course_name: string;
    duration_years: number;
    annual_fees: number;
  }>;
  placement: {
    avg_package_lpa: number;
    placement_percentage: number;
    top_recruiters: string[];
  } | null;
}
