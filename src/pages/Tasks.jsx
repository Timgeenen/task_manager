import { useDispatch, useSelector } from "react-redux"
import { updateTasks, updateTeams } from "../redux/state/authSlice";
import { useEffect } from "react";
import MembersTag from "../components/MembersTag";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Tasks () {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks, teams } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(updateTeams());
    dispatch(updateTasks());
  }, [])

  console.log("TASKS", tasks)
  console.log("TEAMS", teams)
  //TODO: add filter per team
  //TODO: add navigation to task page
  return (
    <div className="w-5/6 m-auto mt-4">
      {tasks.map((task, i) => (
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
