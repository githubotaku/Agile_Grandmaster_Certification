export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const ESSAY_MAX_LENGTH = 5000;

export const SITE_NAME = "Agile Grandmaster Certification";
export const CERT_TITLE = "Agile Grandmaster";
export const CERT_ORG_NAME = "International Jaehwang Lee Agile Committee";
export const SESSION_COOKIE_NAME = "agc_session";
