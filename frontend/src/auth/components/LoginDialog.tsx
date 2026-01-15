import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

// REDUX IMPORTS
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store"; // We need AppDispatch for async thunks
import { loginAsync, clearError, setAuthError } from "../state/authSlice";

interface LoginDialogProps {
  show: boolean;
  handleClose: () => void;
}

function LoginDialog({ show, handleClose }: LoginDialogProps) {
  // Local state for the inputs only
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  // GLOBAL STATE (Read directly from Redux)
  // We don't need local isLoading/error states anymore
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Dispatcher with Type Support
  const dispatch = useDispatch<AppDispatch>();

  // Reset logic when closing
  const onHide = () => {
    dispatch(clearError()); // Clear any old errors from Redux
    handleClose();
  };

  const handleLogin = () => {
    if (!userID || !password) {
      // Simple local validation is fine here
      dispatch(setAuthError("Please enter your credentials!"));
      return;
    }

    // DISPATCH THE THUNK
    // We just say "Do the login". We don't care how.
    dispatch(loginAsync({ userID, password })).then((result) => {
      // "result" tells us if it worked or failed
      if (loginAsync.fulfilled.match(result)) {
        // Success!
        setUserID("");
        setPassword("");
        onHide();
      }
      // If it failed, we don't need to do anything.
      // The 'error' variable from useSelector will automatically update,
      // and the Alert below will show up.
    });
  };

  return (
    <Modal id="LoginDialog" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* 1. ERROR HANDLING: Read directly from Redux */}
        {error && (
          <Alert
            variant="danger"
            onClose={() => dispatch(clearError())}
            dismissible
          >
            {error}
          </Alert>
        )}

        {/* 2. SPINNER LOGIC: Read directly from Redux */}
        {isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                id="LoginDialogUserIDText"
                type="text"
                placeholder="User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                autoFocus
                disabled={isLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="LoginDialogPasswordText"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Close
        </Button>
        <Button
          id="PerformLoginButton"
          variant="primary"
          onClick={handleLogin}
          disabled={isLoading}
        >
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginDialog;
