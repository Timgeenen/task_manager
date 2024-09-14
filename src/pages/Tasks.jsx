import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/Event";
import { sortTasksByDeadline } from "../library/helperfunctions";
import TaskList from "../components/TaskList";
import { useForm } from "react-hook-form";
import DateSelect from "../components/DateSelect.jsx";
import { useSelector } from "react-redux";
import Optionbox from "../components/Optionbox.jsx";
import { LuRefreshCcw } from "react-icons/lu";

function Tasks () {
  const teams = useSelector(state => state.auth.user.teams);

  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => getAllTasks(),
  });

  const { register, control, reset, watch } = useForm({})
  const currentStatus = watch("status");
  const fromDate = watch("from");
  const toDate = watch("to");
  const currentTeam = watch("team");
  const currentPriority = watch("priority");

  const headers = ["Title", "Deadline", "Priority", "Status", "Team", "Members"];
  const status = ["in progress", "pending", "completed"];
  const priority = ["high", "medium", "low"];

  if (isError) { alert(error.message) };
  if (isSuccess) { sortTasksByDeadline(data) };

  return (
    <div className="w-5/6 m-auto mt-4">
      <div className="flex justify-between mt-2 mb-2">
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
        <Optionbox
        options={status}
        register={register("status")}
        defaultText="--Select Status"
        defaultValue="all"
        />
        <Optionbox
        options={priority}
        register={register("priority")}
        defaultText="--Select Priority"
        defaultValue="all"
        />
        <Optionbox
        options={teams}
        register={register("team")}
        defaultValue="all"
        defaultText="--Select Team"
        />
        <button onClick={reset}>
          <LuRefreshCcw size={24}/>
        </button>
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
        status={currentStatus}
        from={fromDate}
        to={toDate}
        team={currentTeam}
        priority={currentPriority}
        />
      }
    </div>
  )
}

export default Tasks
