import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskInfo from "./pages/TaskInfo";
import Teams from "./pages/Teams";
import Trash from "./pages/Trash";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} index />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/taskinfo" element={<TaskInfo />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div>
      <Navbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" replace/>
  )
}

export default App
