/*
 * Course and result data.
 *
 * Source: LASU statement of result for matriculation number 230125013
 * (SHITTU QUADRI ADESHINA), Faculty of Education, Department of Language,
 * Arts and Social Science Education, Discipline: Islamic Religious Studies
 * Education. Printed online 31 July 2026.
 *
 * The official sheet lists course codes only — it does not print course
 * titles — so no titles are invented here. Grade letters are derived from
 * the GP column (5=A, 4=B, 3=C, 2=D, 1=E, 0=F). The status letters (C, R, E)
 * are reproduced exactly as printed.
 */

export const TRANSCRIPT = {
  name: "SHITTU QUADRI ADESHINA",
  matric: "230125013",
  faculty: "Faculty of Education",
  department: "Department of Language, Arts and Social Science Education",
  discipline: "Islamic Religious Studies Education",
  modeOfEntry: "UME",
  yearOfEntry: "2023/2024",
  status: "Good Standing",
  ctcp: 529,
  ctnu: 123,
  cgpa: 4.3,
  printed: "31 July 2026",
};

export const OUTSTANDING = ["ENT 302", "FAC 201", "GNS 301", "ISL 208"];

export const OUTSTANDING_NOTES = [
  "ENT1000 PASSED",
  "Student needs 2 semester(s) to graduate",
  "Not graduating • Outstanding course(s) • TNUP less than required",
];

export const SEMESTERS = [
  {
    id: "100-1",
    session: "2023/2024",
    level: "100 Level",
    semester: "First",
    official: { tnu: 23, tcp: 101, gpa: 4.39, cgpa: 4.39, ctnup: 23 },
    courses: [
      { code: "EDM 111", units: 2, status: "C", grade: "A" },
      { code: "EDU 101", units: 2, status: "C", grade: "C" },
      { code: "GNS 111", units: 2, status: "C", grade: "A" },
      { code: "ISS 101", units: 2, status: "C", grade: "B" },
      { code: "ISS 103", units: 2, status: "C", grade: "A" },
      { code: "ISS 105", units: 2, status: "C", grade: "A" },
      { code: "ISS 107", units: 2, status: "C", grade: "B" },
      { code: "ISS 111", units: 3, status: "R", grade: "A" },
      { code: "ISS 113", units: 3, status: "R", grade: "B" },
      { code: "REP 109", units: 3, status: "C", grade: "B" },
    ],
  },
  {
    id: "100-2",
    session: "2023/2024",
    level: "100 Level",
    semester: "Second",
    official: { tnu: 22, tcp: 94, gpa: 4.27, cgpa: 4.33, ctnup: 45 },
    courses: [
      { code: "ARA 116", units: 2, status: "E", grade: "A" },
      { code: "GNS 104", units: 2, status: "C", grade: "A" },
      { code: "GNS 112", units: 2, status: "C", grade: "E" },
      { code: "IED 102", units: 2, status: "C", grade: "B" },
      { code: "ISS 102", units: 2, status: "C", grade: "B" },
      { code: "ISS 104", units: 2, status: "C", grade: "B" },
      { code: "ISS 106", units: 2, status: "C", grade: "B" },
      { code: "ISS 108", units: 2, status: "E", grade: "A" },
      { code: "ISS 110", units: 3, status: "E", grade: "A" },
      { code: "ISS 112", units: 3, status: "E", grade: "A" },
    ],
  },
  {
    id: "200-1",
    session: "2024/2025",
    level: "200 Level",
    semester: "First",
    official: { tnu: 22, tcp: 94, gpa: 4.27, cgpa: 4.31, ctnup: 67 },
    courses: [
      { code: "EDU 201", units: 2, status: "C", grade: "B" },
      { code: "EFC 201", units: 2, status: "C", grade: "C" },
      { code: "ENT 211", units: 2, status: "C", grade: "A" },
      { code: "ISS 201", units: 2, status: "C", grade: "B" },
      { code: "ISS 203", units: 2, status: "C", grade: "B" },
      { code: "ISS 205", units: 2, status: "C", grade: "A" },
      { code: "ISS 207", units: 2, status: "C", grade: "C" },
      { code: "ISS 209", units: 3, status: "E", grade: "A" },
      { code: "LAS 221", units: 2, status: "C", grade: "B" },
      { code: "REP 211", units: 3, status: "E", grade: "A" },
    ],
  },
  {
    id: "200-2",
    session: "2024/2025",
    level: "200 Level",
    semester: "Second",
    official: { tnu: 19, tcp: 80, gpa: 4.21, cgpa: 4.29, ctnup: 86 },
    courses: [
      { code: "GNS 212", units: 2, status: "C", grade: "C" },
      { code: "HKE 210", units: 2, status: "C", grade: "B" },
      { code: "IED 202", units: 2, status: "C", grade: "B" },
      { code: "ISS 202", units: 2, status: "E", grade: "B" },
      { code: "ISS 204", units: 2, status: "C", grade: "B" },
      { code: "ISS 206", units: 2, status: "C", grade: "A" },
      { code: "ISS 208", units: 2, status: "E", grade: "A" },
      { code: "ISS 212", units: 3, status: "E", grade: "B" },
      { code: "LAS 206", units: 2, status: "C", grade: "A" },
    ],
  },
  {
    id: "300-1",
    session: "2025/2026",
    level: "300 Level",
    semester: "First",
    official: { tnu: 19, tcp: 77, gpa: 4.05, cgpa: 4.25, ctnup: 105 },
    courses: [
      { code: "EDU 301", units: 3, status: "E", grade: "B" },
      { code: "IED 301", units: 2, status: "E", grade: "B" },
      { code: "ISS 321", units: 2, status: "E", grade: "A" },
      { code: "ISS 323", units: 2, status: "E", grade: "B" },
      { code: "ISS 325", units: 2, status: "E", grade: "A" },
      { code: "ISS 327", units: 2, status: "E", grade: "B" },
      { code: "ISS 333", units: 3, status: "E", grade: "C" },
      { code: "ISS 339", units: 3, status: "E", grade: "B" },
    ],
  },
  {
    id: "300-2",
    session: "2025/2026",
    level: "300 Level",
    semester: "Second",
    official: { tnu: 18, tcp: 83, gpa: 4.61, cgpa: 4.3, ctnup: 123 },
    courses: [
      { code: "EDU 302", units: 3, status: "E", grade: "B" },
      { code: "ENT 312", units: 2, status: "E", grade: "A" },
      { code: "GNS 312", units: 2, status: "E", grade: "A" },
      { code: "IED 302", units: 2, status: "E", grade: "B" },
      { code: "ISS 302", units: 2, status: "E", grade: "A" },
      { code: "ISS 304", units: 2, status: "E", grade: "A" },
      { code: "ISS 312", units: 3, status: "E", grade: "A" },
      { code: "LAS 314", units: 2, status: "E", grade: "B" },
    ],
  },
];

/* Sessions a new course would fall into, keyed by level. */
export const LEVEL_SESSION = {
  "100 Level": "2023/2024",
  "200 Level": "2024/2025",
  "300 Level": "2025/2026",
  "400 Level": "2026/2027",
};

export const LEVEL_LABEL = {
  "100 Level": "Foundation",
  "200 Level": "Intermediate",
  "300 Level": "Advanced",
  "400 Level": "Final year",
};
