import { useEffect, useState } from "react";
import MembersTag from "../components/MembersTag";
import { FaArrowRight } from "react-icons/fa";
import { memo } from "react";
import { getHoursLeft, getTimeDiff } from "../library/helperfunctions";

function TaskList({data, status, from, to}) {
  const [filteredData, setFilteredData] = useState(data);


  useEffect(() => {
      const selectedData = data.filter(item => {
        const x = status !== "all" ? item.status === status : true;
        const y = from ? getTimeDiff(from, item.deadline) > 0 : true;
        const z = to ? getTimeDiff(item.deadline, to) > 0 : true;
        if (x & y & z) { return item}
      });
    setFilteredData(selectedData);
  }, [status, from, to]);

  return (
    <div className="h-96 overflow-y-scroll">
      {filteredData.map((task) => {
        const overDue = 
        getHoursLeft(task.deadline) < 0 & task.status !== "completed"
        ? true : false;
        return (
        <div
        key={task._id}
        style={{
          background: 
          task.status === "completed"
          ? "lightgreen"
          : task.status === "pending"
          ? "salmon"
          : "lightblue"
        }}
        className={`grid grid-flow-col auto-cols-fr items-center border-2 p-2 ${overDue ? "border-red-600 font-extrabold" : ""}`}
        >
          <button
          onClick={() => navigate("/task-info/" + task._id)}
          className="flex items-center"
          >
            {task.title}
            <FaArrowRight className="ml-2" size={12}/>
          </button>
          <span
          className={overDue ? "text-red-600 font-extrabold" : ""}
          >
            {task.deadline.split("T")[0]}
            {overDue && <span className="text-2xl ml-2"> !</span>}
          </span>
          <span
          style={{ color: task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "green"}}
          >{task.priority}</span>
          <span>{task.status}</span>
          <span>{task.assignedTeam.name}</span>
          <span className="mr-4">
            {task.assignedTo.map((member, i) => (
              <MembersTag
              member={member.name}
              index={i}
              memberId={member.id}
              />
            ))}
          </span>
        </div>
      )})}
      </div>
  )
}

export default memo(TaskList)
