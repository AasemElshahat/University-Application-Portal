/**
 * DegreeCourse Type Definition
 *
 * Represents a university degree course (Studiengang) in the system.
 * Used throughout the application for degree course management.
 */

export interface DegreeCourse {
  id: string; // Unique identifier from backend
  name: string; // Full degree course name
  shortName: string; // Abbreviated name
  universityName: string; // Full university name
  universityShortName: string; // University abbreviation
  departmentName: string; // Full department name
  departmentShortName: string; // Department abbreviation
}

/**
 * Data structure for creating or updating a degree course
 */
export interface CreateUpdateDegreeCourseData {
  name: string;
  shortName: string;
  universityName: string;
  universityShortName: string;
  departmentName: string;
  departmentShortName: string;
}
