import type {
  AdminEnquiry,
  Creator,
  CreatorStatus,
  Enquiry,
  EnquiryStatus,
  ListOpts,
  NewEnquiry,
  ProfileInput,
  PublicCreator,
} from "./types";

export type AuthRow = {
  id: string;
  handle: string;
  password_hash: string;
  failed_logins: number;
  locked_until: string | null;
};

export type NewCreator = {
  handle: string;
  instagram_url: string;
  display_name: string;
  password_hash: string;
  verify_code: string;
};

/**
 * Everything the app needs from a database. Two implementations:
 * Supabase (production) and an in-memory one (local testing only).
 * All access happens on the server, so every method that touches private data
 * is scoped by creator id explicitly.
 */
export interface Store {
  // public catalog
  listVerified(opts: ListOpts): Promise<PublicCreator[]>;
  getVerifiedByHandle(handle: string): Promise<PublicCreator | null>;

  // creator account
  getCreator(id: string): Promise<Creator | null>;
  getAuthByHandle(handle: string): Promise<AuthRow | null>;
  createCreator(input: NewCreator): Promise<{ ok: true; id: string } | { ok: false; reason: "handle_taken" }>;
  registerLoginFailure(id: string): Promise<void>;
  clearLoginFailures(id: string): Promise<void>;
  updateProfile(id: string, input: ProfileInput): Promise<void>;

  // enquiries
  createEnquiry(e: NewEnquiry): Promise<void>;
  countRecentEnquiriesByIp(ipHash: string, sinceIso: string): Promise<number>;
  listEnquiries(creatorId: string): Promise<Enquiry[]>;
  countNewEnquiries(creatorId: string): Promise<number>;
  updateEnquiry(creatorId: string, enquiryId: string, status: EnquiryStatus, agreedPrice: number | null): Promise<void>;

  // admin
  adminListCreators(): Promise<Creator[]>;
  adminSetStatus(id: string, status: CreatorStatus, followers: number | null): Promise<void>;
  adminSetFollowers(id: string, followers: number | null): Promise<void>;
  adminDeleteCreator(id: string): Promise<void>;
  adminListEnquiries(limit: number): Promise<AdminEnquiry[]>;
}
