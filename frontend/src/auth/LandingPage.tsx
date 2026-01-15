import { Button } from "react-bootstrap";
import LoginDialog from "./components/LoginDialog";
import { useState } from "react";

const LandingPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div
      className="page-content"
      id="LandingPage"
      style={{ background: "white" }}
    >
      <LoginDialog show={show} handleClose={handleClose} />
      <h1>Welcome to the Portal</h1>
      <Button id="OpenLoginDialogButton" variant="light" onClick={handleShow}>
        Login
      </Button>
    </div>
  );
};

export default LandingPage;
