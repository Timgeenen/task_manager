import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

function useNavigateNotification({ teamId, taskId, userId, notificationId, updateFn }) {
  const socket = useSocket();
  const navigate = useNavigate();

  const id = teamId ? teamId : taskId ? taskId : userId;
  const route = teamId ? `/team-info/${id}` : taskId ? `/task-info/${id}` : `/profile/${id}`

  const handleClick = useCallback(() => {
    socket.emit("readNotification", notificationId, (response) => {
      if (response.error) { return console.error(response.error.message) };
      if (updateFn) { updateFn() };
      id && navigate(route);
    });
  }, [userId, notificationId, updateFn]);
  
  return [handleClick]
}

export default useNavigateNotification
