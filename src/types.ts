export interface CollegeListItem {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
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
