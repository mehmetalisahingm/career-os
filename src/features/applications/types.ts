export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "archived";

export interface ApplicationListItem {
  id: string;
  title: string;
  status: ApplicationStatus;
  source: string;
  jobType: string;
  workMode: string | null;
  companyName: string;
  location: string | null;
  listingUrl: string | null;
  followUpAt: string | Date | null;
  appliedAt: string | Date | null;
  createdAt: string | Date;
}
