import type { StudentOverlay } from "@prisma/client";

/**
 * Dev-only mock mode. Set CYGNET_MOCK=1 to render the UI without the ITS
 * database, Prisma, or Keycloak. Never enabled in production builds.
 */
export const MOCK_ENABLED =
  process.env.NODE_ENV !== "production" && process.env.CYGNET_MOCK === "1";

const base = {
  pronouns: "",
  photoPath: "/placeholder.jpg",
  showDorm: true,
  showPhoto: true,
  showProfile: true,
};

export const MOCK_STUDENTS: StudentOverlay[] = [
  { uid: "aaidark1", firstName: "Amirkhan", lastName: "Aidarkhan", dorm: "Willets", dormRoom: "214", gradYear: "2027", ...base },
  { uid: "jchen4", firstName: "Jordan", lastName: "Chen", dorm: "Wharton", dormRoom: "A12", gradYear: "2026", ...base },
  { uid: "mokafor2", firstName: "Maya", lastName: "Okafor", dorm: "Parrish Hall", dormRoom: "308", gradYear: "2028", ...base },
  { uid: "lrivera1", firstName: "Lucas", lastName: "Rivera", dorm: "Mertz", dormRoom: "117", gradYear: "2027", ...base },
  { uid: "pnair3", firstName: "Priya", lastName: "Nair", dorm: "Alice Paul Hall", dormRoom: "402", gradYear: "2029", ...base },
  { uid: "skim7", firstName: "Sam", lastName: "Kim", dorm: "Dana", dormRoom: "22", gradYear: "2026", ...base },
  { uid: "ehaddad1", firstName: "Elena", lastName: "Haddad", dorm: "Kyle", dormRoom: "9", gradYear: "2028", ...base },
  { uid: "tnguyen5", firstName: "Theo", lastName: "Nguyen", dorm: "Worth", dormRoom: "231", gradYear: "2027", ...base },
  { uid: "rsingh2", firstName: "Riya", lastName: "Singh", dorm: "Palmer", dormRoom: "105", gradYear: "2029", ...base },
  { uid: "dwalsh1", firstName: "Declan", lastName: "Walsh", dorm: "Hallowell", dormRoom: "316", gradYear: "2026", ...base, showDorm: false },
  { uid: "amoreno3", firstName: "Ana", lastName: "Moreno", dorm: "Roberts", dormRoom: "7", gradYear: "2028", ...base, showPhoto: false },
  { uid: "kosei1", firstName: "Kenji", lastName: "Osei", dorm: "Woolman", dormRoom: "203", gradYear: "2027", ...base },
];

export function mockFilter(searchParams: { query?: string; filters?: string }) {
  const terms = [
    ...(searchParams.query || "").split(/\s+/),
    ...(searchParams.filters || "").split(","),
  ]
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return MOCK_STUDENTS.filter((s) =>
    terms.every((t) =>
      [s.firstName, s.lastName, s.gradYear, s.dorm, s.dormRoom, s.uid]
        .join(" ")
        .toLowerCase()
        .includes(t)
    )
  );
}

export const MOCK_USER: StudentOverlay = MOCK_STUDENTS[0];
