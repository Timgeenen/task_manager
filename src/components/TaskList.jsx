import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { memo } from "react";
import { getHoursLeft, getTimeDiff } from "../library/helperfunctions";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { ellipsis } from "../library/styles";

function TaskList({data, status, from, to, team, priority}) {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    console.log(status, from, to, team, priority)
      const selectedData = data.filter(item => {
        const x = status !== "all" ? item.status === status : true;
        const y = from ? getTimeDiff(from, item.deadline) > 0 : true;
        const z = to ? getTimeDiff(item.deadline, to) > 0 : true;
        const a = team !== "all" ? item.assignedTeam.id === team : true;
        const b = priority !== "all" ? item.priority === priority : true;
        if (x & y & z & a & b) { return item}
      });
    setFilteredData(selectedData);
  }, [status, from, to, team, priority]);

  return (
    <div className="h-96 overflow-y-scroll rounded-b-xl shadow-lg bg-blue-100">
      {filteredData.map((task) => {
        const overDue = 
        getHoursLeft(task.deadline) < 0 & task.status !== "completed"
        ? true : false;
        return (
        <div
        key={task._id}
        className={clsx(`grid grid-flow-col auto-cols-fr items-center border-2 m-1 h-14 rounded-full bg-opacity-75 hover:shadow-md hover:bg-opacity-100`, overDue && "border-red-600 font-extrabold", task.status === "pending" ? "bg-red-400" : task.status === "completed" ? "bg-green-400" : "bg-blue-400")}
        >
          <button
          onClick={() => navigate("/task-info/" + task._id)}
          className="flex items-center p-2"
          >
            <span className={ellipsis}>{task.title}</span>
            <FaArrowRight className="ml-1" size={12}/>
          </button>
          <span
          className={clsx("p-2", ellipsis, overDue && "text-red-600 font-extrabold")}
          >
            {task.deadline.split("T")[0]}
            {overDue && <span className="text-2xl ml-2"> !</span>}
          </span>
          <span
          className={clsx("p-2", task.priority === "high" ? "text-red-600" : task.priority === "low" ? "text-green-600" : "text-yellow-300")}
          >{task.priority}</span>
          <span className="p-2">{task.status}</span>
          <span className={clsx("p-2", ellipsis)}>{task.assignedTeam.name}</span>
          <span className="ml-6 p-2">
            {task.assignedTo.length}
          </span>
        </div>
      )})}
      </div>
  )
}

export default memo(TaskList)
