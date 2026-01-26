import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createUser } from "../state/userSlice";

interface CreateUserProps {
  show: boolean;
  handleClose: () => void;
}

const CreateUser = ({ show, handleClose }: CreateUserProps) => {
  const [formData, setFormData] = useState({
    userID: "",
    firstName: "",
    lastName: "",
    password: "",
    isAdministrator: false,
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleCreateUser = () => {
    dispatch(createUser(formData)).then((result) => {
      if (createUser.fulfilled.match(result)) {
        handleClose();
        setFormData({
          userID: "",
          firstName: "",
          lastName: "",
          password: "",
          isAdministrator: false,
        });
      }
    });
  };

  return (
    <Modal
      id="UserManagementPageCreateComponent"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>UserID</Form.Label>
            <Form.Control
              id="CreateUserComponentEditUserID"
              type="text"
              placeholder="Enter User ID"
              value={formData.userID}
              onChange={(e) =>
                setFormData({ ...formData, userID: e.target.value })
              }
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              id="CreateUserComponentEditFirstName"
              type="text"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              id="CreateUserComponentEditLastName"
              type="text"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enter Password</Form.Label>
            <Form.Control
              id="CreateUserComponentEditPassword"
              type="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              id="CreateUserComponentEditIsAdministrator"
              type="checkbox"
              label="Is Administrator?"
              checked={formData.isAdministrator}
              onChange={(e) =>
                setFormData({ ...formData, isAdministrator: e.target.checked })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          id="OpenUserManagementPageListComponentButton"
          variant="secondary"
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          id="CreateUserComponentCreateUserButton"
          variant="primary"
          onClick={handleCreateUser}
        >
          Create User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateUser;
