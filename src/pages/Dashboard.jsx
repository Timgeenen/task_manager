import TaskGraph from "../components/TaskGraph";
import Stats from "../components/Stats";

function Dashboard() {
  return (
    <div className="w-full flex flex-col gap-2 items-center">
      Dashboard
      <TaskGraph />
      <Stats />
      {/* active task graph */}
      {/* general stats */}
    </div>
  )
}

export default Dashboard
