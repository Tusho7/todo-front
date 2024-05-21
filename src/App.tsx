import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./components/Tasks";
import AllTasks from "./components/AllTasks";

const App = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const isAuthenticated = !!token;
  const isAdmin = isAuthenticated && userRole === "admin";
  const isUser = isAuthenticated && userRole === "user";

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all-tasks" element={<AllTasks />} />
        <Route
          path="/"
          element={
            isAdmin ? (
              <Navigate to="/dashboard" />
            ) : isUser ? (
              <Navigate to="/tasks" />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/dashboard" element={isAdmin && <Dashboard />} />
        <Route path="/tasks" element={isUser && <Tasks />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
