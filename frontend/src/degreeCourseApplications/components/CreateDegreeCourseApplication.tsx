import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createApplication } from "../state/applicationSlice";
import { loadDegreeCourses } from "../../degreeCourseManagement/state/degreeCourseSlice";
import { AppDispatch, RootState } from "../../store/store";

const CreateDegreeCourseApplication = () => {
  const { degreeCourseID } = useParams<{ degreeCourseID: string }>(); 
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { degreeCourses } = useSelector((state: RootState) => state.degreeCourses);
  const { isLoading, error } = useSelector((state: RootState) => state.applications);

  // Load degree courses if not loaded, to get the name of the target course
  useEffect(() => {
    if (degreeCourses.length === 0) {
      dispatch(loadDegreeCourses());
    }
  }, [dispatch, degreeCourses.length]);

  const targetDegreeCourse = degreeCourses.find(dc => dc.id === degreeCourseID);

  const [formData, setFormData] = useState({
    applicantUserID: user?.userID || "",
    targetPeriodYear: new Date().getFullYear().toString(),
    targetPeriodShortName: "WiSe", // Default to WiSe
  });

  // Ensure user ID is set (for students it's fixed, for admins it might be editable per requirements, 
  // but requirements say "Bei Nicht-Administratoren sollte das Feld mit der User-ID des aktuell eingeloggten Users vorbelegt sein und nicht editierbar sein.")
  // For Admins -> "editierbar sein".
  useEffect(() => {
    if (user && !user.isAdministrator) {
        setFormData(prev => ({ ...prev, applicantUserID: user.userID }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!degreeCourseID) {
        alert("Invalid Degree Course ID");
        return;
    }

    if (!formData.applicantUserID || !formData.targetPeriodYear || !formData.targetPeriodShortName) {
      alert("Please fill in all fields");
      return;
    }

    const payload = {
        applicantUserID: formData.applicantUserID,
        degreeCourseID: degreeCourseID,
        targetPeriodYear: parseInt(formData.targetPeriodYear),
        targetPeriodShortName: formData.targetPeriodShortName
    };

    const result = await dispatch(createApplication(payload));

    if (createApplication.fulfilled.match(result)) {
      navigate("/degreeCourseApplicationManagement");
    }
  };

  const handleCancel = () => {
    navigate("/degreeCourseManagement"); // Go back to course list where we came from
  };

  if (!targetDegreeCourse) {
      return (
          <Container className="mt-4">
              <Alert variant="warning">Loading Degree Course information...</Alert>
          </Container>
      )
  }

  return (
    <Container id="DegreeCourseApplicationManagementPageCreateComponent" className="mt-4">
      <Card>
        <Card.Header as="h4">Create Application for {targetDegreeCourse.name}</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Degree Course Name (Read Only) */}
            <Form.Group className="mb-3">
              <Form.Label>Degree Course</Form.Label>
              <Form.Control
                type="text"
                value={targetDegreeCourse.name}
                disabled
              />
            </Form.Group>

            {/* Applicant User ID */}
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                id="CreateDegreeCourseApplicationEditUserID"
                type="text"
                name="applicantUserID"
                value={formData.applicantUserID}
                onChange={handleChange}
                // Read-only if NOT admin
                disabled={!user?.isAdministrator}
                required
              />
            </Form.Group>

            {/* Year */}
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                id="CreateDegreeCourseApplicationEditTargetPeriodYear"
                type="number"
                name="targetPeriodYear"
                value={formData.targetPeriodYear}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Semester Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Select
                id="CreateDegreeCourseApplicationEditTargetPeriodName"
                name="targetPeriodShortName"
                value={formData.targetPeriodShortName}
                onChange={handleChange}
              >
                <option value="WiSe">Wintersemester (WiSe)</option>
                <option value="SoSe">Sommersemester (SoSe)</option>
              </Form.Select>
            </Form.Group>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                id="CreateDegreeCourseApplicationCreateButton"
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Perform Create"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateDegreeCourseApplication;
