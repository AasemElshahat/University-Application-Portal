import { useEffect, useState } from "react";
import { Container, Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loadApplications, deleteApplication } from "./state/applicationSlice";
import { AppDispatch, RootState } from "../store/store";
import DeleteDialog from "../components/DeleteDialog";

const DegreeCourseApplicationManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, isLoading, error } = useSelector(
    (state: RootState) => state.applications
  );

  useEffect(() => {
    dispatch(loadApplications());
  }, [dispatch]);

  // DELETE DIALOG STATE
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

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
          ) : applications.length === 0 ? (
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
                {applications.map((app) => (
                  <tr key={app.id} id={`DegreeCourseApplicationItem${app.id}`}>
                    <td id="ApplicantUserID">{app.applicantUserID}</td>
                    <td id="DegreeCourseName">{app.degreeCourseName || app.degreeCourseID}</td>
                    <td id="TargetPeriodYear">{app.targetPeriodYear}</td>
                    <td id="TargetPeriodShortName">{app.targetPeriodShortName}</td>
                    <td id="UniversityShortName">{app.universityName}</td>
                    <td id="DepartmentShortName">{app.departmentName}</td>
                    <td>
                        <Button
                            id={`DegreeCourseApplicationDeleteButton${app.id}`}
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
