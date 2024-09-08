import MembersTag from "../components/MembersTag";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/Event";

function Tasks () {
  const navigate = useNavigate();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => getAllTasks(),
    staleTime: Infinity
  });

  if (isError) { alert(error.message) };

  return (
    <div className="w-5/6 m-auto mt-4">
      {isLoading && <div>Loading...</div>}
      {data?.map((task) => (
        <div
        key={task._id}
        className="flex justify-between items-center border-2 p-2"
        >
          <span>{task.description}</span>
          <span>{task.deadline.split("T")[0]}</span>
          <span>{task.priority}</span>
          <span>{task.status}</span>
          <span>{task.assignedTeam.name}</span>
          <span className="mr-4">
            {task.assignedTo.map((member, i) => (
              <MembersTag
              member={member.name}
              index={i}
              />
            ))}
          </span>
          <button onClick={() => navigate("/task-info/" + task._id)}>
            <FaArrowRight size={24}/>
          </button>
        </div>
      ))}
    </div>
  )
}

export default Tasks
