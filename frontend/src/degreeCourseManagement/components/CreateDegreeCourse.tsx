import { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createDegreeCourse } from "../state/degreeCourseSlice";
import { AppDispatch, RootState } from "../../store/store";

const CreateDegreeCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.degreeCourses
  );

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    universityName: "",
    universityShortName: "",
    departmentName: "",
    departmentShortName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const result = await dispatch(createDegreeCourse(formData));

    if (createDegreeCourse.fulfilled.match(result)) {
      // Success - navigate back to list
      navigate("/degreeCourseManagement");
    }
  };

  const handleCancel = () => {
    navigate("/degreeCourseManagement");
  };

  return (
    <Container id="DegreeCourseManagementPageCreateComponent" className="mt-4">
      <Card>
        <Card.Header as="h4">Create New Degree Course</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Degree Course Name */}
            <Form.Group className="mb-3">
              <Form.Label>Degree Course Name *</Form.Label>
              <Form.Control
                id="CreateDegreeCourseComponentEditName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Medieninformatik Bachelor"
                required
              />
              <Form.Text className="text-muted">
                Full name of the degree course
              </Form.Text>
            </Form.Group>

            {/* Degree Course Short Name */}
            <Form.Group className="mb-3">
              <Form.Label>Degree Course Short Name *</Form.Label>
              <Form.Control
                id="CreateDegreeCourseComponentEditShortName"
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="e.g., MD-BA"
                required
              />
              <Form.Text className="text-muted">
                Abbreviated name of the degree course
              </Form.Text>
            </Form.Group>

            {/* University Name */}
            <Form.Group className="mb-3">
              <Form.Label>University Name *</Form.Label>
              <Form.Control
                id="CreateDegreeCourseComponentEditUniversityName"
                type="text"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g., Berliner Hochschule für Technik"
                required
              />
              <Form.Text className="text-muted">
                Full name of the university
              </Form.Text>
            </Form.Group>

            {/* University Short Name */}
            <Form.Group className="mb-3">
              <Form.Label>University Short Name *</Form.Label>
              <Form.Control
                id="CreateDegreeCourseComponentEditUniversityShortName"
                type="text"
                name="universityShortName"
                value={formData.universityShortName}
                onChange={handleChange}
                placeholder="e.g., BHT"
                required
              />
              <Form.Text className="text-muted">
                Abbreviated name of the university
              </Form.Text>
            </Form.Group>

            {/* Department Name */}
            <Form.Group className="mb-3">
              <Form.Label>Department Name *</Form.Label>
              <Form.Control
                id="CreateDegreeCourseComponentEditDepartmentName"
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                placeholder="e.g., Informatik und Medien"
                required
              />
              <Form.Text className="text-muted">
                Full name of the department
              </Form.Text>
            </Form.Group>

            {/* Department Short Name */}
            <Form.Group className="mb-3">
              <Form.Label>Department Short Name *</Form.Label>
              <Form.Control
                id="CreateDegreeCourseComponentEditDepartmentShortName"
                type="text"
                name="departmentShortName"
                value={formData.departmentShortName}
                onChange={handleChange}
                placeholder="e.g., FB VI"
                required
              />
              <Form.Text className="text-muted">
                Abbreviated name of the department
              </Form.Text>
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
                id="CreateDegreeCourseComponentCreateDegreeCourseButton"
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Degree Course"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateDegreeCourse;
