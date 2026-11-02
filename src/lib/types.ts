export type CreatorStatus = "pending" | "verified" | "rejected";
export type EnquiryStatus = "new" | "contacted" | "booked" | "declined";

/** Fields that are safe to show to the public. */
export type PublicCreator = {
  id: string;
  handle: string;
  instagram_url: string;
  display_name: string;
  city: string;
  niche: string | null;
  languages: string[];
  audience: string | null;
  video_types: string[];
  best_reel_url: string | null;
  ambition: string | null;
  deal_types: string[];
  price_reel: number | null;
  followers: number | null;
  created_at: string;
};

/** Full row, only ever shown to the owner or the admin. */
export type Creator = PublicCreator & {
  verify_code: string;
  status: CreatorStatus;
  verified_at: string | null;
};

export type Enquiry = {
  id: string;
  creator_id: string;
  contact_name: string;
  brand_name: string;
  phone: string;
  email: string | null;
  business_type: string | null;
  budget_band: string | null;
  message: string;
  status: EnquiryStatus;
  agreed_price: number | null;
  created_at: string;
  status_changed_at: string | null;
};

export type AdminEnquiry = Enquiry & { creator_name: string; creator_handle: string };

export type ProfileInput = {
  display_name: string;
  city: string;
  niche: string | null;
  languages: string[];
  audience: string | null;
  video_types: string[];
  best_reel_url: string | null;
  ambition: string | null;
  deal_types: string[];
  price_reel: number | null;
};

export type NewEnquiry = {
  creator_id: string;
  contact_name: string;
  brand_name: string;
  phone: string;
  email: string | null;
  business_type: string | null;
  budget_band: string | null;
  message: string;
  ip_hash: string;
};

export type ListOpts = {
  niche?: string;
  q?: string;
  sort?: "followers" | "price" | "new";
  limit?: number;
};

/** Returned by server actions to client forms. Error values are dictionary keys. */
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string | string[]>;
  ok?: boolean;
  message?: string;
};

export type SessionUser = { id: string; email: string };
