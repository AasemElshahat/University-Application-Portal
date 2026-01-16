export interface DegreeCourseApplication {
    id: string;
    applicantUserID: string;
    degreeCourseID: string;
    targetPeriodYear: number;
    targetPeriodShortName: string;
    // Optional fields for display if backend populates them, 
    // otherwise we might need to fetch them separately or join on frontend.
    // Based on "ApplicationModel.ts", only the IDs are stored.
    // However, the List view usually requires names. 
    // We will assume for now we only get what's in the model, 
    // and might need to lookup names from the DegreeCourse list if loaded.
    degreeCourseName?: string; 
    degreeCourseShortName?: string;
    universityName?: string;
    departmentName?: string;
}
