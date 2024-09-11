import Comment from "./Comment"
import Commentbox from "./Commentbox"
import { memo, useEffect, useState } from "react";
import io from "socket.io-client";
import { BACKEND } from "../library/constants";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentsByTaskId } from "../api/Event";

function Chatroom({ taskId }) {
  const { user } = useSelector(state => state.auth);
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();

  const {
    isLoading,
    isSuccess,
    isError,
    error,
    data
  } = useQuery({
    queryKey: [`comments-${taskId}`],
    queryFn: () => getCommentsByTaskId(taskId)
  });

  useEffect(() => {
    const newSocket = io(BACKEND, {
      auth: {
        user: user
      }
    });
    setSocket(newSocket)

    newSocket.emit("joinTaskRoom", taskId);

    newSocket.on("receiveMessage", (newMessage) => {
      queryClient.setQueryData(
        [`comments-${taskId}`],
        (oldValue) => {
          const { comments } = oldValue;
          return { comments: [newMessage, ...(comments || [])] };
        }
      );
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    }
  }, [taskId]);

  const addMessage = async (messageData) => {
    await socket.emit("sendMessage", messageData);
  };

  if (isError) { console.error(error.message) };
  
  return (
    <>
      <Commentbox 
      taskId={taskId}
      submitHandler={addMessage}
      />
      <div className="flex flex-col gap-2 h-screen overflow-y-scroll w-full">
        {isLoading && <div>Loading....</div>}
        {isSuccess && data?.comments?.map((comment) => (
          <Comment
          authorName={comment.author.name}
          authorId={comment.author.id}
          message={comment.message}
          commentId={comment._id}
          date={comment.createdAt}
          />
        ))}
      </div>
    </>
  )
}

export default memo(Chatroom)
