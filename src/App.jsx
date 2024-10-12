import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { RxHamburgerMenu } from "react-icons/rx";
import { setOpenSidebar } from "./redux/state/authSlice";
import SocketProvider from "./context/SocketProvider";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import Footer from "./components/Footer";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateTask = lazy(() => import("./pages/CreateTask"));
const Tasks = lazy(() => import("./pages/Tasks"));
const TaskInfo = lazy(() => import("./pages/TaskInfo"))
const Teams = lazy(() => import("./pages/Teams"));
const TeamInfo = lazy(() => import("./pages/TeamInfo"));
const CreateTeam = lazy(() => import("./pages/CreateTeam"));
const Connections = lazy(() => import("./pages/Connections"));
const FindConnections = lazy(() => import("./pages/FindConnections"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} index />
        <Route path="/dashboard" element={
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
          } />
        <Route path="/create-task" element={
          <Suspense fallback={<Loading />}>
            <CreateTask />
          </Suspense>
          } />
        <Route path="/tasks" element={
          <Suspense fallback={<Loading />}>
            <Tasks />
          </Suspense>
          } />
        <Route path="/task-info">
          <Route path=":taskId" element={
            <Suspense fallback={<Loading />}>
              <TaskInfo />
            </Suspense>
            } />
        </Route>
        <Route path="/teams" element={
          <Suspense fallback={<Loading />}>
            <Teams />
          </Suspense>
          } />
        <Route path="/team-info">
          <Route path=":teamId" element={
            <Suspense fallback={<Loading />}>
              <TeamInfo />
            </Suspense>
            } />
        </Route>
        <Route path="/create-team" element={
          <Suspense fallback={<Loading />}>
            <CreateTeam />
          </Suspense>
          } />
        <Route path="/connections" element={
          <Suspense fallback={<Loading />}>
            <Connections />
          </Suspense>
          } />
        <Route path="/find-connections" element={
          <Suspense fallback={<Loading />}>
            <FindConnections />
          </Suspense>
          } />
        <Route path="/profile">
          <Route path=":userId" element={
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
            } />
        </Route>
      </Route>
      <Route path="/login" element={
        <Login />} />
    </Routes>
  )
}

function Layout() {
  const { user } = useSelector(state => state.auth);
  const { isSidebarOpen } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return user ? (
    <SocketProvider>
      <div className="relative min-h-screen overflow-y-hidden">
        <Navbar />
        <div className="h-full flex w-screen">
          {
          isSidebarOpen ? 
          <Sidebar /> : 
          <RxHamburgerMenu 
          className="left-4 top-20 absolute hover:cursor-pointer bg-blue-600 text-white p-2 rounded-full border z-50"
          size={40}
          onClick={() => { dispatch(setOpenSidebar(true)) }}/>
          }
          <Outlet />
        </div>
        <Footer />
      </div>
    </SocketProvider>
  ) : (
    <Navigate to="/login" replace/>
  )
}

export default App
