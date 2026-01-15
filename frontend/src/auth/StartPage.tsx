import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "./state/authSlice";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div
      className="page-content"
      id="StartPage"
      style={{ background: "white" }}
    >
      {user?.firstName || user?.lastName ? (
        <h1>
          Hello, {user?.firstName} {user?.lastName}!
        </h1>
      ) : (
        <h1>Hello, {user?.userID}!</h1>
      )}
      {user?.isAdministrator && (
        <Button
          id="OpenUserManagementPageButton"
          variant="primary"
          size="lg"
          onClick={() => navigate("/userManagement")} // <--- 3. Navigate
        >
          Open User Management
        </Button>
      )}
      <Button id="LogoutButton" variant="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default StartPage;
