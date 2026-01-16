import { Container } from "react-bootstrap";

const LandingPage = () => {
  return (
    <Container
      id="LandingPage"
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <h1 className="display-4 text-center mb-4">Welcome to the University Portal</h1>
      <p className="lead text-center text-muted">
        Please use the login button in the navigation bar to access your account.
      </p>
    </Container>
  );
};

export default LandingPage;
