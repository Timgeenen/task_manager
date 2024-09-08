import { useParams } from "react-router-dom";
import { getTaskById } from "../api/Event";
import { useQuery } from "@tanstack/react-query";
import MembersTag from "../components/MembersTag";
import { getTimePassed } from "../library/helperfunctions";
import Commentbox from "../components/Commentbox";
import Comment from "../components/Comment";

function TaskInfo() {
  const { taskId } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`task-${taskId}`],
    queryFn: () => getTaskById(taskId),
    staleTime: Infinity
  });

  const updateTask = (data) => {
    console.log(data);
  }

  if (isPending) { return ( <div>Loading...</div> ) };
  if (error) { return ( <div>{error.message}</div> ) };
  data && console.log(data)
  return (
    <div className="w-10/12 flex flex-col justify-between m-auto border-2">
      <div className="flex justify-between items-center w-full border-2">
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
      <div className="flex flex-col gap-2 h-40 overflow-y-scroll w-full">
        {data?.comments.map((comment, i) => (
          <Comment
          authorName={comment.author.name}
          authorId={comment.author.id}
          message={comment.message}
          commentId={comment._id}
          date={comment.createdAt}
          />
          // <div>
          //   <span>{comment.author.name}</span>
          //   <span>{comment.message}</span>
          //   <span>{getTimePassed(comment.createdAt)} ago</span>
          // </div>
        ))}
      </div>
      <Commentbox taskId={taskId} />
      <button
      className="border-2 w-40 p-3"
      onClick={updateTask}>UPDATE TASK</button>
    </div>
  )
}

export default TaskInfo
