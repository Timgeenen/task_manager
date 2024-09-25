import Comment from "./Comment"
import Commentbox from "./Commentbox"
import { memo, useEffect, useState } from "react";
import io from "socket.io-client";
import { BACKEND } from "../library/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentsById } from "../api/Event";
import useAuthorize from "../hooks/useAuthorize";

function Chatroom({ socketId, socketType }) {
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
    queryFn: () => getCommentsById(socketId, socketType)
  });

  const [isAuthorized] = useAuthorize();

  useEffect(() => {
    if (isAuthorized) {
      const newSocket = io(BACKEND, {
        withCredentials: true
      });
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
          setSocket(null);
        };
      };
    };
  }, [isAuthorized]);

  const addMessage = async (messageData) => {
    await socket.emit("sendMessage", messageData);
  };

  if (isError) { console.error(error.message) };
  
  return (
    <div className="bg-blue-50 p-2 rounded-lg shadow-lg">
      <Commentbox 
      socketId={socketId}
      submitHandler={addMessage}
      socketType={socketType}
      />
      <div className="flex flex-col gap-2 h-64 p-2 overflow-y-scroll w-full rounded-lg">
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
    </div>
  )
}

export default memo(Chatroom)
