import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../store/store";
import { clearUserError, loadUsers, deleteUser } from "./state/userSlice";
import {
  Table,
  Alert,
  Spinner,
  Container,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";
import CreateUser from "./components/CreateUser";
import EditUser from "./components/EditUser";
import DeleteDialog from "../components/DeleteDialog";

const UserManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  const handleUserDelete = () => {
    if (userToDelete)
      dispatch(deleteUser(userToDelete?.userID)).then((result) => {
        if (deleteUser.fulfilled.match(result)) {
          handleClose();
          return result;
        }
      });
  };

  // CREATE USER
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateUserModalClose = () => setShowCreateModal(false);
  const handleCreateUserModalShow = () => setShowCreateModal(true);

  // UPDATE USER
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const handleEditUserModalClose = () => setShowEditModal(false);
  const handleEditUserModalShow = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  return (
    <Container id="UserManagementPage" className="mt-4">
      <h1>User Management</h1>

      <Button
        id="OpenStartPageButton"
        variant="primary"
        size="lg"
        onClick={() => navigate("/home")}
      >
        Homepage
      </Button>

      <Button
        id="UserManagementPageCreateUserButton"
        variant="primary"
        size="lg"
        onClick={handleCreateUserModalShow}
      >
        Create user
      </Button>

      <CreateUser
        show={showCreateModal}
        handleClose={handleCreateUserModalClose}
      />

      <EditUser
        show={showEditModal}
        handleClose={handleEditUserModalClose}
        user={userToEdit}
      />

      {error && (
        <Alert
          variant="danger"
          onClose={() => dispatch(clearUserError())}
          dismissible
        >
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table id="UserManagementPageListComponent" striped bordered hover>
          <thead>
            <tr>
              <th>UserID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Administrator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr id={`UserItem${user.userID}`} key={user.userID}>
                <td id="UserID">{user.userID}</td>
                <td id="FirstName">{user.firstName}</td>
                <td id="LastName">{user.lastName}</td>
                <td id="IsAdministrator">
                  {user.isAdministrator ? "Yes" : "No"}
                </td>
                <td>
                  <Button
                    id={"UserItemDeleteButton" + user.userID}
                    variant="danger"
                    onClick={() => {
                      setUserToDelete(user);
                      setShow(true);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    id={"UserItemEditButton" + user.userID}
                    variant="primary"
                    onClick={() => {
                      handleEditUserModalShow(user);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <DeleteDialog
        show={show}
        entityType="User"
        entityId={userToDelete?.userID || ""}
        entityName={userToDelete?.userID || ""}
        onConfirm={handleUserDelete}
        onCancel={handleClose}
      />
    </Container>
  );
};

export default UserManagementPage;
