import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "./state/authSlice";
import { Button, Alert } from "react-bootstrap";
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
        <Alert variant="info" className="mt-3">
          You have Administrator privileges. Use the Navbar to manage users.
        </Alert>
      )}
    </div>
  );
};

export default StartPage;
