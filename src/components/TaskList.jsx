import { useEffect, useState } from "react";
import { memo } from "react";
import { getHoursLeft, getTimeDiff } from "../library/helperfunctions";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { ellipsis } from "../library/styles";

function TaskList({data, status, from, to, team, priority}) {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
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
    <div
    className="h-96 pl-1 pr-1 overflow-y-scroll rounded-t-xl md:rounded-t-none rounded-b-xl shadow-lg bg-blue-100">
      {filteredData.map((task) => {
        const overDue = 
        getHoursLeft(task.deadline) < 0 & task.status !== "completed"
        ? true : false;
        return (
        <button
        onClick={() => navigate(`/task-info/${task._id}`)}
        key={task._id}
        className={clsx(`grid w-full grid-cols-6 items-center border mt-1 mb-1 text-start text-sm sm:text-md sm:h-10 rounded-lg md:rounded-full bg-opacity-75 hover:shadow-md hover:bg-opacity-100 `, overDue && "bg-red-300 border-red-600 font-extrabold", task.status === "completed" ? "bg-green-400" : "bg-white")}
        >
          <span className={clsx("p-2 pb-0 sm:pb-2 col-span-4 sm:col-span-1", ellipsis)}>{task.title}</span>
          <span
          className={clsx("p-2 pb-0 sm:pb-2 col-span-2 sm:col-span-1", task.priority === "high" ? "text-red-600" : task.priority === "low" ? "text-green-600" : "text-yellow-300")}
          >{task.priority}</span>
          <span
          className={clsx("p-2 pt-0 col-span-4 sm:col-span-1", ellipsis, overDue && "text-red-600 font-extrabold")}
          >
            {task.deadline.split("T")[0]}
            {overDue && <span className="text-2xl ml-2"> !</span>}
          </span>
          <span className={clsx("p-2 pt-0 sm:pt-2 col-span-2 sm:col-span-1", ellipsis)}>{task.status}</span>
          <span className={clsx("p-2 hidden sm:block sm:col-span-1", ellipsis)}>{task.assignedTeam.name}</span>
          <span className="ml-6 p-2 hidden sm:block sm:col-span-1">
            {task.assignedTo.length}
          </span>
        </button>
      )})}
      </div>
  )
}

export default memo(TaskList)
