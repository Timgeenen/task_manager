import Comment from "./Comment"
import Commentbox from "./Commentbox"
import { memo, useEffect, useState } from "react";
import io from "socket.io-client";
import { BACKEND } from "../library/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Chatroom({ socketId, queryFn, socketType }) {
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();

  const {
    isLoading,
    isSuccess,
    isError,
    error,
    data
  } = useQuery({
    queryKey: [`comments-${socketId}`],
    queryFn: queryFn
  });

  useEffect(() => {
    const newSocket = io(BACKEND);
    setSocket(newSocket)

    newSocket.emit("joinTaskRoom", socketId);

    newSocket.on("receiveMessage", (newMessage) => {
      queryClient.setQueryData(
        [`comments-${socketId}`],
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
  }, [socketId]);

  const addMessage = async (messageData) => {
    await socket.emit("sendMessage", messageData);
  };

  if (isError) { console.error(error.message) };
  
  return (
    <>
      <Commentbox 
      socketId={socketId}
      submitHandler={addMessage}
      socketType={socketType}
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
