import { useParams } from "react-router-dom";
import { getTaskById } from "../api/Event";
import { useQuery } from "@tanstack/react-query";
import Chatroom from "../components/Chatroom";
import TaskEdit from "../components/TaskEdit";
import TaskOverview from "../components/TaskOverview";
import Loading from "../components/Loading";

function TaskInfo() {
  const { taskId } = useParams();

  const {
    isPending,
    isError,
    error,
    data
  } = useQuery({
    queryKey: [`task-${taskId}`],
    queryFn: () => getTaskById(taskId),
  });

  if (isPending) { return ( <Loading /> ) };
  if (isError) { return ( <div>{ error.message }</div> ) };

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
      workingOnTask={data?.workingOnTask}
      teamMembers={data?.assignedTo}
      managerId={data?.managerId}
      />
      <Chatroom
      socketId={taskId}
      socketType="task"
      />
    </div>
  )
}

export default TaskInfo
