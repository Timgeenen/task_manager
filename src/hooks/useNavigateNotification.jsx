import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function useNavigateNotification({ teamId, taskId, userId, notificationId, updateFn }) {
  const { socket } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const id = teamId ? teamId : taskId ? taskId : userId;
  const route = teamId ? `/team-info/${id}` : taskId ? `/task-info/${id}` : `/profile/${id}`

  const handleClick = () => {
    socket.emit("readNotification", userId, notificationId, (response) => {
      if (response.error) { return console.error(response.error.message) };
      if (updateFn) { updateFn() };
      navigate(route);
    });
  };
  return [handleClick]
}

export default useNavigateNotification
