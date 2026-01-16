import { useEffect, useState } from "react";
import { Container, Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadDegreeCourses,
  deleteDegreeCourse,
} from "./state/degreeCourseSlice";
import { AppDispatch, RootState } from "../store/store";
import DeleteDialog from "../components/DeleteDialog";

const DegreeCourseManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { degreeCourses, isLoading, error } = useSelector(
    (state: RootState) => state.degreeCourses
  );
  const user = useSelector((state: RootState) => state.auth.user);

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDegreeCourse, setSelectedDegreeCourse] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Load degree courses on mount
  useEffect(() => {
    dispatch(loadDegreeCourses());
  }, [dispatch]);

  const handleCreateClick = () => {
    navigate("/degreeCourseManagement/create");
  };

  const handleEditClick = (id: string) => {
    navigate(`/degreeCourseManagement/edit/${id}`);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedDegreeCourse({ id, name });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDegreeCourse) {
      await dispatch(deleteDegreeCourse(selectedDegreeCourse.id));
      setShowDeleteDialog(false);
      setSelectedDegreeCourse(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSelectedDegreeCourse(null);
  };

  const handleCreateApplication = (id: string) => {
    // Navigate to create application page with pre-selected degree course
    navigate(`/degreeCourseApplicationManagement/create/${id}`);
  };

  return (
    <Container id="DegreeCourseManagementPage" className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Degree Course Management</h4>
          {user?.isAdministrator && (
            <Button
              id="DegreeCourseManagementPageCreateDegreeCourseButton"
              variant="primary"
              onClick={handleCreateClick}
            >
              + Create Degree Course
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : degreeCourses.length === 0 ? (
            <Alert variant="info">
              No degree courses found. Create one to get started!
            </Alert>
          ) : (
            <Table
              id="DegreeCourseManagementPageListComponent"
              striped
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th>Short Name</th>
                  <th>Degree Course</th>
                  <th>University</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {degreeCourses.map((dc) => (
                  <tr key={dc.id} id={`DegreeCourseItem${dc.id}`}>
                    <td>
                      <strong>{dc.shortName}</strong>
                    </td>
                    <td id="Name">{dc.name}</td>
                    <td id="UniversityName">
                      {dc.universityName} ({dc.universityShortName})
                    </td>
                    <td id="DepartmentName">
                      {dc.departmentName} ({dc.departmentShortName})
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        {/* Edit button - Admin only */}
                        {user?.isAdministrator && (
                          <Button
                            id={`DegreeCourseItemEditButton${dc.id}`}
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditClick(dc.id)}
                          >
                            Edit
                          </Button>
                        )}

                        {/* Delete button - Admin only */}
                        {user?.isAdministrator && (
                          <Button
                            id={`DegreeCourseItemDeleteButton${dc.id}`}
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(dc.id, dc.name)}
                          >
                            Delete
                          </Button>
                        )}

                        {/* Create Application button - All users */}
                        <Button
                          id={`CreateDegreeCourseApplicationForDegreeCourse${dc.id}`}
                          variant="success"
                          size="sm"
                          onClick={() => handleCreateApplication(dc.id)}
                        >
                          Create Application
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Dialog */}
      {selectedDegreeCourse && (
        <DeleteDialog
          show={showDeleteDialog}
          entityType="DegreeCourse"
          entityId={selectedDegreeCourse.id}
          entityName={selectedDegreeCourse.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </Container>
  );
};

export default DegreeCourseManagementPage;
