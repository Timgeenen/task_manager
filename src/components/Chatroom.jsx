import Comment from "./Comment"
import Commentbox from "./Commentbox"
import { memo, useEffect, useState } from "react";
import io from "socket.io-client";
import { BACKEND } from "../library/constants";

function Chatroom({ taskId, messagesArr }) {

  const [messages, setMessages] = useState(messagesArr);
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(BACKEND);
    setSocket(newSocket)

    newSocket.emit("joinTaskRoom", taskId);

    newSocket.on("receiveMessage", (newMessage) => {
      console.log(newMessage)
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    }
  }, [taskId]);

  const addMessage = async (data) => {
    await socket.emit("sendMessage", data);
  }

  return (
    <>
      <Commentbox 
      taskId={taskId}
      submitHandler={addMessage}
      />
      <div className="flex flex-col gap-2 h-screen overflow-y-scroll w-full">
          {messages?.map((comment) => (
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
