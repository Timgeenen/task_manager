import clsx from "clsx";
import MembersTag from "./MembersTag";

function TaskOverview({
  teamName,
  teamMembers,
  deadline,
  title,
  priority,
  status
}) {
  return (
    <div className="sm:flex">
    <div className="flex justify-between w-full border border-b-0 rounded-t-lg sm:rounded-tr-none sm:rounded-l-lg sm:border sm:border-r-0 p-1 pr-2 pl-2 gap-2 overflow-clip">
      <TaskDescription
      label="Title"
      value={title}
      />
      <TaskDescription
      label="Team Name"
      value={teamName}
      />
      <TaskDescription
      label="Assigned To"
      value={teamMembers.map((member, i) => (
          <MembersTag member={member.name} index={i} />
        ))}
      />
    </div>
    <div className="flex justify-between rounded-b-lg sm:rounded-bl-none sm:rounded-r-lg w-full border border-t-0 sm:border sm:border-l-0 p-1 pr-2 gap-2 pl-2">
      <TaskDescription
      label="Deadline"
      value={deadline.split("T")[0]}
      />
      <TaskDescription
      label="Priority"
      value={priority}
      textClass={
        priority === "low" ?
        "text-green-500" :
        priority === "medium" ?
        "text-yellow-500" :
        "text-red-500"
      }
      />
      <TaskDescription
      label="Status"
      value={status}
      textClass={
        status === "completed" ?
        "text-green-500" :
        status === "in progress" ?
        "text-yellow-500" :
        "text-blue-500"
      }
      />
    </div>
    </div>
  )
}

function TaskDescription({ label, value, textClass, className }) {
  return (
    <div className={clsx(className, "w-1/3 flex flex-col gap-1")}>
      <span className="text-xs font-semibold">{label}</span>
      <span className={clsx(textClass, "text-xs sm:text-sm md:text-lg")}>{value}</span>
    </div>
  )
}

export default TaskOverview