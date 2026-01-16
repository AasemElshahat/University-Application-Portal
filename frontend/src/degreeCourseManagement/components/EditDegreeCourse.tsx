import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editDegreeCourse } from "../state/degreeCourseSlice";
import { AppDispatch, RootState } from "../../store/store";

const EditDegreeCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { degreeCourses, isLoading, error } = useSelector(
    (state: RootState) => state.degreeCourses
  );

  // Find the degree course to edit
  const degreeCourse = degreeCourses.find((dc) => dc.id === id);

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    universityName: "",
    universityShortName: "",
    departmentName: "",
    departmentShortName: "",
  });

  // Pre-populate form when degree course is found
  useEffect(() => {
    if (degreeCourse) {
      setFormData({
        name: degreeCourse.name,
        shortName: degreeCourse.shortName,
        universityName: degreeCourse.universityName,
        universityShortName: degreeCourse.universityShortName,
        departmentName: degreeCourse.departmentName,
        departmentShortName: degreeCourse.departmentShortName,
      });
    }
  }, [degreeCourse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      alert("No degree course ID provided");
      return;
    }

    // Validate all fields are filled
    if (
      !formData.name ||
      !formData.shortName ||
      !formData.universityName ||
      !formData.universityShortName ||
      !formData.departmentName ||
      !formData.departmentShortName
    ) {
      alert("Please fill in all fields");
      return;
    }

    const result = await dispatch(
      editDegreeCourse({ id, degreeCourse: formData })
    );

    if (editDegreeCourse.fulfilled.match(result)) {
      // Success - navigate back to list
      navigate("/degreeCourseManagement");
    }
  };

  const handleCancel = () => {
    navigate("/degreeCourseManagement");
  };

  // If degree course not found, show error
  if (!degreeCourse) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Degree course not found. Please go back to the list.
        </Alert>
        <Button onClick={handleCancel}>Back to List</Button>
      </Container>
    );
  }

  return (
    <Container id="DegreeCourseManagementPageEditComponent" className="mt-4">
      <Card>
        <Card.Header as="h4">
          Edit Degree Course: {degreeCourse.shortName}
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Degree Course Name */}
            <Form.Group className="mb-3">
              <Form.Label>Degree Course Name *</Form.Label>
              <Form.Control
                id="EditDegreeCourseComponentEditName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Medieninformatik Bachelor"
                required
              />
            </Form.Group>

            {/* Degree Course Short Name */}
            <Form.Group className="mb-3">
              <Form.Label>Degree Course Short Name *</Form.Label>
              <Form.Control
                id="EditDegreeCourseComponentEditShortName"
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="e.g., MD-BA"
                required
              />
            </Form.Group>

            {/* University Name */}
            <Form.Group className="mb-3">
              <Form.Label>University Name *</Form.Label>
              <Form.Control
                id="EditDegreeCourseComponentEditUniversityName"
                type="text"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g., Berliner Hochschule für Technik"
                required
              />
            </Form.Group>

            {/* University Short Name */}
            <Form.Group className="mb-3">
              <Form.Label>University Short Name *</Form.Label>
              <Form.Control
                id="EditDegreeCourseComponentEditUniversityShortName"
                type="text"
                name="universityShortName"
                value={formData.universityShortName}
                onChange={handleChange}
                placeholder="e.g., BHT"
                required
              />
            </Form.Group>

            {/* Department Name */}
            <Form.Group className="mb-3">
              <Form.Label>Department Name *</Form.Label>
              <Form.Control
                id="EditDegreeCourseComponentEditDepartmentName"
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                placeholder="e.g., Informatik und Medien"
                required
              />
            </Form.Group>

            {/* Department Short Name */}
            <Form.Group className="mb-3">
              <Form.Label>Department Short Name *</Form.Label>
              <Form.Control
                id="EditDegreeCourseComponentEditDepartmentShortName"
                type="text"
                name="departmentShortName"
                value={formData.departmentShortName}
                onChange={handleChange}
                placeholder="e.g., FB VI"
                required
              />
            </Form.Group>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Button
                id="OpenDegreeCourseManagementPageListComponentButton"
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                id="EditDegreeCourseComponentSaveDegreeCourseButton"
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditDegreeCourse;
