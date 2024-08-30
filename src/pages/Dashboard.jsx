import TaskGraph from "../components/TaskGraph";
import Stats from "../components/Stats";

function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      Dashboard
      <TaskGraph />
      <Stats />
      {/* active task graph */}
      {/* general stats */}
    </div>
  )
}

export default Dashboard
