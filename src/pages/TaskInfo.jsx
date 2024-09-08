import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getTaskById } from "../api/Event";
import { useQuery } from "@tanstack/react-query";
import MembersTag from "../components/MembersTag";
import { getTimePassed } from "../library/helperfunctions";

function TaskInfo() {
  const { taskId } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`task-${taskId}`],
    queryFn: () => getTaskById(taskId),
    staleTime: Infinity
  });

  const { register, control } = useForm();

  const updateTask = (data) => {
    console.log(data);
  }

  if (isPending) { return ( <div>Loading...</div> ) };
  if (error) { return ( <div>{error.message}</div> ) };
  
  console.log(data)
  return (
    <div className="w-10/12 flex flex-col justify-between m-auto">
      <div className="flex gap-8 items-center">
        <span>{data?.title}</span>
        <span>{data?.assignedTeam.name}</span>
        <span className="mr-4">{data?.assignedTo.map((member, i) => (
          <MembersTag member={member.name} index={i} />
        ))}</span>
      </div>
      <div className="flex gap-8 items-center">
        <textarea value={data?.description}></textarea>
        {/* TODO: add checkbox for each subtask */}
        <span>{data?.priority}</span>
        <span>{data?.status}</span>
      </div>
      <div>
        {data?.comments.map((comment, i) => (
          <>
            <span>{comment.author}</span>
            <span>{comment.message}</span>
            <span>{getTimePassed(comment.createdAt)}</span></>
        ))}
      </div>
      <button
      className="border-2 w-40 p-3"
      onClick={updateTask}>UPDATE TASK</button>
    </div>
  )
}

export default TaskInfo
