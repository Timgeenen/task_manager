import { useParams } from "react-router-dom";
import { getTaskById } from "../api/Event";
import { useQuery } from "@tanstack/react-query";
import MembersTag from "../components/MembersTag";
import Chatroom from "../components/Chatroom";

function TaskInfo() {
  const { taskId } = useParams();

  const {
    isPending,
    isError,
    isSuccess,
    error,
    data
  } = useQuery({
    queryKey: [`task-${taskId}`],
    queryFn: () => getTaskById(taskId),
    staleTime: Infinity
  });

  const updateTask = (data) => {
    console.log(data);
  }

  if (isPending) { return ( <div>Loading...</div> ) };
  if (isError) { return ( <div>{error.message}</div> ) };

  return (
    <div className="w-10/12 flex flex-col justify-between m-auto border-2">
      <div className="flex justify-between items-center w-full border-2">
        <span>{data?.title}</span>
        <span>{data?.assignedTeam.name}</span>
        <span className="mr-4">
          {data?.assignedTo.map((member, i) => (
          <MembersTag member={member.name} index={i} />
        ))}
        </span>
      </div>
      <div className="flex gap-8 items-center">
        <textarea value={data?.description}></textarea>
        <span>{data?.priority}</span>
        <span>{data?.status}</span>
      </div>
      <div>
        <button
        className="border-2 w-40 p-3"
        onClick={updateTask}
        >UPDATE TASK
        </button>
      </div>
      <Chatroom
      taskId={taskId}
      messagesArr={data.comments}
      />
    </div>
  )
}

export default TaskInfo
