import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function useNavigateNotification({ teamId, taskId, userId, notificationId, updateFn }) {
  const { socket, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const id = teamId ? teamId : taskId ? taskId : userId;
  const route = teamId ? `/team-info/${id}` : taskId ? `/task-info/${id}` : `/profile/${id}`

  const handleClick = useCallback(() => {
    socket.emit("readNotification", user._id, notificationId, (response) => {
      if (response.error) { return console.error(response.error.message) };
      if (updateFn) { updateFn() };
      navigate(route);
    });
  }, [userId, notificationId, updateFn]);
  
  return [handleClick]
}

export default useNavigateNotification
