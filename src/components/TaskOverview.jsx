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
    <div className="flex justify-between items-center w-full border-2 p-1 pr-2 pl-2">
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
      <TaskDescription
      label="Deadline"
      value={deadline.split("T")[0]}
      />
      <TaskDescription
      label="Priority"
      value={priority}
      />
      <TaskDescription
      label="Status"
      value={status}
      />
    </div>
  )
}

function TaskDescription({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      <span className="text-lg">{value}</span>
    </div>
  )
}

export default TaskOverview