import { useParams } from "react-router-dom";
import { getTaskById } from "../api/Event";
import { useQuery } from "@tanstack/react-query";
import Chatroom from "../components/Chatroom";
import TaskEdit from "../components/TaskEdit";
import TaskOverview from "../components/TaskOverview";

function TaskInfo() {
  const { taskId } = useParams();

  const {
    isPending,
    isError,
    error,
    refetch,
    data
  } = useQuery({
    queryKey: [`task-${taskId}`],
    queryFn: () => getTaskById(taskId),
  });

  if (isPending) { return ( <div>Loading...</div> ) };
  if (isError) { return ( <div>{ error.message }</div> ) };
console.log(data)
  return (
    <div className="w-10/12 flex flex-col justify-between m-auto border-2">
      <TaskOverview
      teamName={data?.assignedTeam.name}
      teamMembers={data?.assignedTo}
      deadline={data?.deadline}
      title={data?.title}
      priority={data?.priority}
      status={data?.status}
      />
      <TaskEdit
      teamId={data?.assignedTeam.id}
      taskId={data?._id}
      description={data?.description}
      subtasks={data?.subtasks}
      priority={data?.priority}
      status={data?.status}
      refetch={refetch}
      />
      <Chatroom
      taskId={taskId}
      />
    </div>
  )
}

export default TaskInfo
