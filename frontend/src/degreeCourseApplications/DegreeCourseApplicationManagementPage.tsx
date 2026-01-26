import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loadApplications, deleteApplication } from "./state/applicationSlice";
import { loadDegreeCourses } from "../degreeCourseManagement/state/degreeCourseSlice";
import { AppDispatch, RootState } from "../store/store";
import DeleteDialog from "../components/DeleteDialog";

const DegreeCourseApplicationManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, isLoading, error } = useSelector(
    (state: RootState) => state.applications,
  );
  const { degreeCourses } = useSelector(
    (state: RootState) => state.degreeCourses,
  );

  useEffect(() => {
    dispatch(loadApplications());
    // Load degree courses for client-side join (fallback if backend doesn't populate)
    if (degreeCourses.length === 0) {
      dispatch(loadDegreeCourses());
    }
  }, [dispatch, degreeCourses.length]);

  // DELETE DIALOG STATE
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const handleDeleteClick = (id: string) => {
    setSelectedApplicationId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedApplicationId) {
      dispatch(deleteApplication(selectedApplicationId));
      setShowDeleteDialog(false);
      setSelectedApplicationId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSelectedApplicationId(null);
  };

  // Enrich applications with degree course data (resilient approach)
  // Works whether backend populates data or not
  const enrichedApplications = applications.map((app) => {
    // If backend already populated the data, use it directly
    if (app.degreeCourseName && app.universityName && app.departmentName) {
      return app;
    }

    // Otherwise, do client-side join as fallback
    const degreeCourse = degreeCourses.find(
      (dc) => dc.id === app.degreeCourseID,
    );
    return {
      ...app,
      degreeCourseName:
        app.degreeCourseName || degreeCourse?.name || app.degreeCourseID,
      degreeCourseShortName:
        app.degreeCourseShortName || degreeCourse?.shortName,
      universityName:
        app.universityName || degreeCourse?.universityShortName || "",
      departmentName:
        app.departmentName || degreeCourse?.departmentShortName || "",
    };
  });

  return (
    <Container id="DegreeCourseApplicationManagementPage" className="mt-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Application Management</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : enrichedApplications.length === 0 ? (
            <Alert variant="info">No applications found.</Alert>
          ) : (
            <Table
              id="DegreeCourseApplicationManagementPageListComponent"
              striped
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Degree Course</th>
                  <th>Year</th>
                  <th>Semester</th>
                  <th>University</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrichedApplications.map((app) => (
                  <tr key={app.id} id={`DegreeCourseApplicationItem${app.id}`}>
                    <td id="ApplicantUserID">{app.applicantUserID}</td>
                    <td id="DegreeCourseName">{app.degreeCourseName}</td>
                    <td id="TargetPeriodYear">{app.targetPeriodYear}</td>
                    <td id="TargetPeriodShortName">
                      {app.targetPeriodShortName}
                    </td>
                    <td id="UniversityShortName">{app.universityName}</td>
                    <td id="DepartmentShortName">{app.departmentName}</td>
                    <td>
                      <Button
                        id={`DegreeCourseApplicationItemDeleteButton${app.id}`}
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(app.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {selectedApplicationId && (
        <DeleteDialog
          show={showDeleteDialog}
          entityType="DegreeCourseApplication"
          entityId={selectedApplicationId}
          entityName={`Application ${selectedApplicationId}`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </Container>
  );
};

export default DegreeCourseApplicationManagementPage;
