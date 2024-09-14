import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/Event";
import { sortTasksByDeadline } from "../library/helperfunctions";
import { useState } from "react";
import TaskList from "../components/TaskList";

function Tasks () {
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => getAllTasks(),
  });

  const [filter, setFilter] = useState("all");

  const headers = ["Title", "Deadline", "Priority", "Status", "Team", "Members"];
  const status = ["in progress", "pending", "completed"];

  if (isError) { alert(error.message) };
  if (isSuccess) { sortTasksByDeadline(data) };

  return (
    <div className="w-5/6 m-auto mt-4">
      <div>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Tasks</option>
        {status.map(stat => (
          <option value={stat}>{stat}</option>
        ))}
      </select>
      </div>
      {isLoading && <div>Loading...</div>}
      <div className="sticky grid grid-flow-col auto-cols-fr items-center bg-blue-400">
        {
          headers.map((item, i) => (
            <span
            className="border-2 p-1"
            key={`header-${i}`}
            >{item}</span>
          ))
        }
      </div>
      {isSuccess && 
        <TaskList
        data={data}
        filter={filter}
        />
      }
    </div>
  )
}

export default Tasks
