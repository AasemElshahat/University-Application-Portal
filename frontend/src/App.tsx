import LandingPage from "./auth/LandingPage";
import StartPage from "./auth/StartPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";
import UserManagementPage from "./userManagement/UserManagementPage";
import NavigationBar from "./components/Navigation/Navbar";
import DegreeCourseManagementPage from "./degreeCourseManagement/DegreeCourseManagementPage";
import CreateDegreeCourse from "./degreeCourseManagement/components/CreateDegreeCourse";
import EditDegreeCourse from "./degreeCourseManagement/components/EditDegreeCourse";
import DegreeCourseApplicationManagementPage from "./degreeCourseApplications/DegreeCourseApplicationManagementPage";
import CreateDegreeCourseApplication from "./degreeCourseApplications/components/CreateDegreeCourseApplication";

const App = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <LandingPage />}
        />
        <Route
          path="/home"
          element={user ? <StartPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/userManagement"
          element={
            user?.isAdministrator ? (
              <UserManagementPage />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        {/* Degree Course Management - All authenticated users can view */}
        <Route
          path="/degreeCourseManagement"
          element={
            user ? <DegreeCourseManagementPage /> : <Navigate to="/" replace />
          }
        />
        {/* Create Degree Course - Admin only */}
        <Route
          path="/degreeCourseManagement/create"
          element={
            user?.isAdministrator ? (
              <CreateDegreeCourse />
            ) : (
              <Navigate to="/degreeCourseManagement" replace />
            )
          }
        />
        {/* Edit Degree Course - Admin only */}
        <Route
          path="/degreeCourseManagement/edit/:id"
          element={
            user?.isAdministrator ? (
              <EditDegreeCourse />
            ) : (
              <Navigate to="/degreeCourseManagement" replace />
            )
          }
        />
        {/* Degree Course Application Management - Authenticated Users */}
        <Route
          path="/degreeCourseApplicationManagement"
          element={
            user ? <DegreeCourseApplicationManagementPage /> : <Navigate to="/" replace />
          }
        />
        {/* Create Application for a Degree Course - Authenticated Users */}
        {/* The requirements say "Daher sollte es im Studiengang einen Button zum Anlegen von Studienbewerbungen geben" */}
        <Route
          path="/degreeCourseApplicationManagement/create/:degreeCourseID"
          element={
             user ? <CreateDegreeCourseApplication /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
