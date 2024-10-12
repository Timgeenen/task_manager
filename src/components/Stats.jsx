import Countup from "./Countup"
import { countTasksByStatus, sortTasksByDeadline } from "../library/helperfunctions";
import { useEffect, useState } from "react";
import TasksListSmall from "./TasksListSmall";

const taskStyle = "text-nowrap overflow-hidden p-1 border-2 border-gray-300 border-black"
const titleStyle = "pt-1"

function Stats({ data, selectedTeam }) {

  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const selectedTasks = selectedTeam === "all" ?
    data : data.filter(task => task.assignedTeam.id === selectedTeam);
    sortTasksByDeadline(selectedTasks);
    const currentData = countTasksByStatus(selectedTasks);
    setStatusData(currentData);
  }, [selectedTeam]);

  return (
    <div className="min-w-72">
      
      <div className="w-full flex justify-around border-t-2 border-b-2 border-slate-300 mb-2">
        {
          statusData.map((item) => (
            <Countup
            actual={item.count}
            total={
              item.status === "completed"
              ? item.count
              : data.length}
            parameter={item.status}
            radius={20}
            />
          ))
        }
      </div>
      
      <TasksListSmall
      data={data}
      selectedTeam={selectedTeam}
      />
    </div>
  )
}

export default Stats
