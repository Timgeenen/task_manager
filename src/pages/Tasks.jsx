import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/Event";
import { sortTasksByDeadline } from "../library/helperfunctions";
import TaskList from "../components/TaskList";
import { useForm } from "react-hook-form";
import DateSelect from "../components/DateSelect.jsx";

function Tasks () {
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => getAllTasks(),
  });

  const { register, control, reset, watch } = useForm({})
  const currentStatus = watch("status");
  const fromDate = watch("from");
  const toDate = watch("to");

  const headers = ["Title", "Deadline", "Priority", "Status", "Team", "Members"];
  const status = ["in progress", "pending", "completed"];

  if (isError) { alert(error.message) };
  if (isSuccess) { sortTasksByDeadline(data) };

  return (
    <div className="w-5/6 m-auto mt-4">
      <div>
        <select {...register("status")}>
          <option value="all">All Tasks</option>
          {status.map(stat => (
            <option value={stat}>{stat}</option>
          ))}
        </select>
        <DateSelect
        control={control}
        text="From"
        name="from"
        maxDate={toDate}
        />
        <DateSelect
        control={control}
        text="To"
        name="to"
        minDate={fromDate}
        />
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
        filter={currentStatus}
        />
      }
    </div>
  )
}

export default Tasks
