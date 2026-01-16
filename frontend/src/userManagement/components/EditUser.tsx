import { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { editUser } from "../state/userSlice";
import { AppDispatch } from "../../store/store";

interface EditUserProps {
  show: boolean;
  handleClose: () => void;
  user: {
    userID: string;
    firstName?: string;
    lastName?: string;
    isAdministrator?: boolean;
  } | null;
}

const EditUser = ({ show, handleClose, user }: EditUserProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [editFormData, setEditFormData] = useState({
    userID: "",
    firstName: "",
    lastName: "",
    password: "",
    isAdministrator: false,
  });

  useEffect(() => {
    if (user) {
      setEditFormData({
        userID: user.userID,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "",
        isAdministrator: user.isAdministrator || false,
      });
    }
  }, [user]);

  const handleEditUser = () => {
    // Build payload with only non-empty fields to avoid overwriting with empty values
    const payload: Record<string, string | boolean> = {
      userID: editFormData.userID,
      isAdministrator: editFormData.isAdministrator,
    };

    if (editFormData.firstName.trim()) {
      payload.firstName = editFormData.firstName;
    }
    if (editFormData.lastName.trim()) {
      payload.lastName = editFormData.lastName;
    }
    // Only include password if user entered a new one
    if (editFormData.password.trim()) {
      payload.password = editFormData.password;
    }

    dispatch(editUser(payload as any)).then((result) => {
      if (editUser.fulfilled.match(result)) {
        handleClose();
        setEditFormData({
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
      id="UserManagementPageEditComponent"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>UserID</Form.Label>
            <Form.Control
              id="EditUserComponentEditUserID"
              type="text"
              placeholder="Enter User ID"
              value={editFormData.userID}
              onChange={(e) =>
                setEditFormData({ ...editFormData, userID: e.target.value })
              }
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              id="EditUserComponentEditFirstName"
              type="text"
              placeholder="Enter First Name"
              value={editFormData.firstName}
              onChange={(e) =>
                setEditFormData({ ...editFormData, firstName: e.target.value })
              }
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              id="EditUserComponentEditLastName"
              type="text"
              placeholder="Enter Last Name"
              value={editFormData.lastName}
              onChange={(e) =>
                setEditFormData({ ...editFormData, lastName: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enter Password</Form.Label>
            <Form.Control
              id="EditUserComponentEditPassword"
              type="password"
              placeholder="Enter Password"
              value={editFormData.password}
              onChange={(e) =>
                setEditFormData({ ...editFormData, password: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              id="EditUserComponentEditIsAdministrator"
              type="checkbox"
              label="Is Administrator?"
              checked={editFormData.isAdministrator}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  isAdministrator: e.target.checked,
                })
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
          id="EditUserComponentSaveUserButton"
          variant="primary"
          onClick={handleEditUser}
        >
          Edit User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
