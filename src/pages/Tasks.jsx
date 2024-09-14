import MembersTag from "../components/MembersTag";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/Event";
import { sortTasksByDeadline } from "../library/helperfunctions";

function Tasks () {
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => getAllTasks(),
  });

  if (isError) { alert(error.message) };
  if (isSuccess) { sortTasksByDeadline(data) };

  return (
    <div className="w-5/6 m-auto mt-4">
      {isLoading && <div>Loading...</div>}
      <div></div>
      <div>
      {data?.map((task) => (
        <div
        key={task._id}
        style={{background: task.status === "completed" ? "lightgreen" : task.status === "pending" ? "salmon" : "lightblue"}}
        className="grid grid-flow-col auto-cols-fr items-center border-2 p-2"
        >
          <button
          onClick={() => navigate("/task-info/" + task._id)}
          className="flex items-center"
          >
            {task.title}
            <FaArrowRight className="ml-2" size={12}/>
          </button>
          <span>{task.deadline.split("T")[0]}</span>
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
      ))}
      </div>
    </div>
  )
}

export default Tasks
