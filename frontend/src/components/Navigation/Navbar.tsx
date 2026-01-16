import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { logout } from "../../auth/state/authSlice";
import { useState } from "react";
import LoginDialog from "../../auth/components/LoginDialog";

const NavigationBar = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const handleLoginClose = () => setShowLogin(false);
    const handleLoginShow = () => setShowLogin(true);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm" sticky="top">
            <Container>
                <LoginDialog show={showLogin} handleClose={handleLoginClose} />
                <Navbar.Brand as={Link} to={user ? "/home" : "/"}>
                    University Portal
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/home" id="OpenStartPageButton">Home</Nav.Link>
                                {user.isAdministrator && (
                                    <Nav.Link as={Link} to="/userManagement" id="OpenUserManagementPageButton">User Management</Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/degreeCourseManagement" id="OpenDegreeCourseManagementPageButton">Degree Courses</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            <>
                                <Navbar.Text className="me-3 text-light">
                                    Signed in as: <strong>{user.firstName ? `${user.firstName} ${user.lastName}` : user.userID}</strong>
                                </Navbar.Text>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={handleLogout}
                                    id="LogoutButton"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={handleLoginShow}
                                id="OpenLoginDialogButton"
                            >
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
