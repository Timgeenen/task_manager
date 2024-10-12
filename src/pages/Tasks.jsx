import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/Event";
import { sortTasksByDeadline } from "../library/helperfunctions";
import TaskList from "../components/TaskList";
import { useForm } from "react-hook-form";
import DateSelect from "../components/DateSelect.jsx";
import { useSelector } from "react-redux";
import Optionbox from "../components/Optionbox.jsx";
import { LuRefreshCcw } from "react-icons/lu";
import Loading from "../components/Loading";
import clsx from "clsx";
import { inputStyle } from "../library/styles.jsx";


function Tasks () {
  const teams = useSelector(state => state.auth.user.teams);

  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => getAllTasks(),
  });

  const defaultValues = {
      status: "all",
      team: "all",
      priority: "all",
      from: "",
      to: ""
    };

  const { register, control, reset, watch } = useForm({
    defaultValues: defaultValues
  });
  const currentStatus = watch("status");
  const fromDate = watch("from");
  const toDate = watch("to");
  const currentTeam = watch("team");
  const currentPriority = watch("priority");

  const headers = ["Title", "Priority", "Deadline", "Status", "Team", "Members"];
  const status = ["in progress", "pending", "completed"];
  const priority = ["high", "medium", "low"];

  const paramClasses = "bg-blue-100"

  if (isError) { alert(error.message) };
  if (isSuccess) { sortTasksByDeadline(data) };

  return (
    <div className="w-5/6 max-w-3xl m-auto mt-10">
      <div className="flex flex-wrap gap-2 justify-center">
          <DateSelect
          control={control}
          text="From"
          name="from"
          maxDate={toDate}
          classes={paramClasses}
          />
          <DateSelect
          control={control}
          text="To"
          name="to"
          minDate={fromDate}
          classes={paramClasses}
          />
          <Optionbox
          options={status}
          register={register("status")}
          defaultText="--Select Status"
          defaultValue="all"
          classes={paramClasses}
          />
          <Optionbox
          options={priority}
          register={register("priority")}
          defaultText="--Select Priority"
          defaultValue="all"
          classes={paramClasses}
          />
          <Optionbox
          options={teams}
          register={register("team")}
          defaultValue="all"
          defaultText="--Select Team"
          classes={paramClasses}
          />
          <button
          className={clsx(inputStyle, "flex justify-center items-center text-white bg-red-600")}
          onClick={() => reset(defaultValues)}>
            <LuRefreshCcw size={20}/>
            <span
            className="ml-2"
            >Reset Filters</span>
          </button>
      </div>
      <div className="m-2">
        <div className="sticky grid grid-flow-col auto-cols-fr items-center bg-blue-400 rounded-t-xl pl-2 pr-2 font-semibold">
          {
            headers.map((item, i) => (
              <span
              className="p-2 hidden sm:block"
              key={`header-${i}`}
              >{item}</span>
            ))
          }
        </div>
        {isLoading && <Loading />}
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
    </div>
  )
}

export default Tasks
